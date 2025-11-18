import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { interviewService, responseService } from '../api';
import { FiArrowLeft, FiArrowRight, FiX, FiCheck } from 'react-icons/fi';


const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Estados del formulario
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Estados del reconocimiento de voz
  const [isListening, setIsListening] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [voiceStatus, setVoiceStatus] = useState(''); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Referencias
  const recognitionRef = useRef(null);
  const userAnswerRef = useRef('');
  const totalTimeIntervalRef = useRef(null);

  useEffect(() => {
    fetchInterview();
    // eslint-disable-next-line
  }, [interviewId]);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setUserAnswer(prev => {
            const newAnswer = prev + finalTranscript;
            userAnswerRef.current = newAnswer;
            return newAnswer;
          });
        }
        if (interimTranscript) setVoiceStatus(`Escuchando: ${interimTranscript}`);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (userAnswerRef.current.trim()) {
          setIsConfirming(true);
          setVoiceStatus('Revisa tu respuesta y confirma o reintenta.');
        } else {
          setVoiceStatus('Haz clic en el micrófono para intentarlo de nuevo.');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setVoiceStatus('Error de reconocimiento de voz. Revisa tu micrófono.');
        setIsListening(false);
        toast.error('Error de reconocimiento de voz.');
      };

      totalTimeIntervalRef.current = window.setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceStatus('El reconocimiento de voz no es compatible con tu navegador.');
      toast.error('Reconocimiento de voz no soportado.');
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (totalTimeIntervalRef.current) clearInterval(totalTimeIntervalRef.current);
    };
  }, []);

  // Temporizador de respuesta
  useEffect(() => {
    let answerTimer;
    if (isListening) {
      answerTimer = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(answerTimer);
  }, [isListening]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await interviewService.getInterview(interviewId);
      const interviewData = response.data.interview;
      setInterview(interviewData);

      if (interviewData.status === 'in_progress') {
        const map = {};
        (interviewData.questions || []).forEach((q, idx) => {
          if (q?.responses?.[0]?.responseText)
            map[idx] = q.responses[0].responseText;
        });
        setResponses(map);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error loading interview');
      navigate('/interviews');
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = interview && interview.status === 'completed';
  const isInProgress = interview && interview.status === 'in_progress';
  const questions = interview?.questions || [];
  const question = questions[currentQuestion] || {};

  const responseSaved = question?.responses?.[0]?.responseText || '';
  const localResponse = responses[currentQuestion] || '';

  const allAnswered = questions.every((q, idx) => {
    if (isCompleted)
      return q?.responses?.[0]?.responseText?.trim().length > 0;
    const saved = q?.responses?.[0]?.responseText;
    const temp = responses[idx];
    return (temp && temp.trim().length > 0) || (saved && saved.trim().length > 0);
  });

  const handleResponseChange = (e) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: e.target.value
    }));
  };

  const handleSaveResponse = async () => {
    const resp = (responses[currentQuestion] || '').trim();
    if (!resp) {
      toast.warning('Introduce una respuesta antes de continuar');
      return;
    }
    try {
      setSubmitting(true);
      const questionId = question._id;
      await responseService.submitResponse({
        questionId,
        interviewId,
        responseText: resp
      });
      toast.success('Respuesta guardada');
      await fetchInterview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar respuesta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      setSubmitting(true);
      await interviewService.updateInterviewStatus(interviewId, { status: 'completed' });
      toast.success('¡Entrevista completada!');
      setTimeout(() => navigate('/interviews'), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al completar la entrevista');
    } finally {
      setSubmitting(false);
    }
  };

  const handleListenToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else if (recognitionRef.current) {
      setUserAnswer('');
      userAnswerRef.current = '';
      setElapsedTime(0);
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceStatus('Escuchando...');
    }
  };

  const handleConfirmAnswer = () => {
    if (!userAnswer.trim()) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: userAnswer.trim()
    }));
    setIsConfirming(false);
    setUserAnswer('');
    userAnswerRef.current = '';
    setElapsedTime(0);
    setVoiceStatus('Respuesta confirmada. Procede al siguiente paso.');
  };

  const handleRetryAnswer = () => {
    setIsConfirming(false);
    setUserAnswer('');
    userAnswerRef.current = '';
    setElapsedTime(0);
    setVoiceStatus('Puedes empezar a grabar de nuevo cuando quieras.');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!interview || !questions.length) {
    return <div className="text-center p-8">{t('interview.noInterviews')}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {interview?.title}
            </h1>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {currentQuestion + 1}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Difficulty: {question?.difficulty || 'unknown'}
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {question?.questionText || question?.question || 'Question not found'}
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('interview.answer')}
            </label>

            {isCompleted ? (
              <div className="min-h-[50px] p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-4">
                {responseSaved ? responseSaved : <span className="text-gray-400">{t('interview.noResponse')}</span>}
              </div>
            ) : isInProgress ? (
              <div>
                {/* Área de entrada con reconocimiento de voz o textarea */}
                {isConfirming ? (
                  <div className="min-h-[100px] p-4 rounded bg-indigo-50 dark:bg-indigo-900 border-2 border-indigo-400 text-gray-800 dark:text-white mb-4">
                    <p className="font-semibold mb-2">Tu respuesta (Pendiente de confirmación):</p>
                    <p className="italic">{userAnswer}</p>
                  </div>
                ) : (
                  <textarea
                    value={localResponse || userAnswer}
                    onChange={handleResponseChange}
                    disabled={isListening || submitting}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    rows="6"
                    placeholder={t('Pregunta sin responder.')}
                  />
                )}

                {/* Estado del reconocimiento de voz */}
                {voiceStatus && (
                  <div className="mt-2 p-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded">
                    {voiceStatus}
                  </div>
                )}

                {/* Tiempos */}
                {(isListening || isConfirming) && (
                  <div className="flex justify-between items-center mt-2 px-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Tiempo de Respuesta: {formatTime(elapsedTime)}</span>
                    <span>Tiempo Total: {formatTime(totalTime)}</span>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3 mt-4">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={handleRetryAnswer}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md px-4 py-2 transition"
                      >
                        Reintenta Respuesta
                      </button>
                      <button
                        onClick={handleConfirmAnswer}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2 transition"
                      >
                        Confirmar Respuesta
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleListenToggle}
                        disabled={submitting}
                        className={`flex-1 w-20 h-12 rounded-lg flex items-center justify-center justify-center gap-2 font-semibold transition-all duration-300
                          ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                          disabled:bg-gray-400 disabled:cursor-not-allowed`}
                      >
                        <MicrophoneIcon />
                        {isListening ? 'Detener' : 'Grabar'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveResponse}
                        disabled={submitting || localResponse.trim().length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 transition disabled:opacity-50"
                      >
                        Guardar respuesta
                      </button>
                    </>
                  )}
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {!isConfirming && (isListening ? 'Haz clic en el micrófono para detener' : 'Haz clic en el micrófono para grabar tu respuesta')}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex gap-4 items-center">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="flex items-center gap-2 border-2 border-gray-400 px-4 py-2 rounded-lg font-semibold text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiArrowLeft /> {t('interview.previousQuestion')}
              </button>
            )}
            {currentQuestion < questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="flex items-center gap-2 border-2 border-gray-400 px-4 py-2 rounded-lg font-semibold text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t('interview.nextQuestion')} <FiArrowRight />
              </button>
            )}
            <div className="flex-1"></div>
            {currentQuestion === questions.length - 1
              ? (isCompleted ? (
                  <button
                    onClick={() => navigate('/interviews')}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold transition ml-auto"
                  >
                    <FiX /> Salir
                  </button>
                ) : isInProgress && allAnswered ? (
                  <button
                    onClick={handleCompleteInterview}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-semibold transition ml-auto disabled:opacity-50"
                  >
                    <FiCheck /> Completar entrevista
                  </button>
                ) : isInProgress ? (
                  <button
                    onClick={() => navigate('/interviews')}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold transition ml-auto"
                  >
                    <FiX /> Salir
                  </button>
                ) : null)
              : (
                <button
                  onClick={() => navigate('/interviews')}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold transition ml-auto"
                >
                  <FiX /> Salir
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;