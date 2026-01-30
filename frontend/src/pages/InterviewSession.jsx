/**
 * @fileoverview Página de sesión interactiva de entrevista técnica.
 * Gestiona el flujo completo de una entrevista incluyendo:
 * - Navegación entre preguntas
 * - Reconocimiento de voz mediante Web Speech API
 * - Guardado de respuestas en el backend
 * - Vista de resultados y feedback generado por IA
 * 
 * @module pages/InterviewSession
 * @requires react
 * @requires react-router-dom
 * @requires react-i18next
 * @requires react-toastify
 * @requires react-icons/fi
 * @requires ../api
 * @requires ../store
 * @requires ../assets/styles/InterviewSession.css
 */

/**
 * Componente principal de sesión de entrevista interactiva.
 * Gestiona navegación entre preguntas, reconocimiento de voz, guardado de respuestas
 * y vista de resultados completados con feedback de IA.
 * 
 * @component
 * @returns {JSX.Element} Interfaz completa de sesión de entrevista
 * 
 * @description
 * Componente que maneja el flujo completo de una entrevista técnica:
 * 
 * **Funcionalidades principales:**
 * - Carga entrevista y preguntas desde API
 * - Captura respuestas mediante texto o voz (Web Speech API)
 * - Almacena respuestas en backend automáticamente
 * - Navega entre preguntas con indicador de progreso
 * - Genera feedback con IA al finalizar
 * - Muestra vista completa de resultados con puntuaciones
 * - Soporta tema claro/oscuro
 * 
 * **Estados principales:**
 * - interview: Datos de la entrevista actual
 * - currentQuestion: Índice de la pregunta actual
 * - responses: Respuestas temporales del usuario (antes de guardar)
 * - isListening: Si micrófono está grabando
 * - isConfirming: Si hay respuesta de voz pendiente de confirmación
 * - userAnswer: Texto transcrito del micrófono
 * - elapsedTime: Tiempo de grabación actual
 * - totalTime: Tiempo total desde inicio de sesión
 * 
 * **Flujo de la sesión:**
 * 1. Cargar entrevista y preguntas
 * 2. Mostrar pregunta actual
 * 3. Usuario responde por texto o voz
 * 4. Guardar respuesta en backend
 * 5. Navegar a siguiente pregunta
 * 6. Repetir hasta última pregunta
 * 7. Generar feedback con IA
 * 8. Mostrar resultados con puntuaciones
 * 
 * @example
 * // Uso en rutas de App.js
 * <Route
 *   path="/interview/:interviewId"
 *   element={<ProtectedRoute><InterviewSession /></ProtectedRoute>}
 * />
 */

/**
 * Interview session page
 * Interactive interview player / session view used during live interviews.
 * @module pages/InterviewSession
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { interviewService, responseService } from '../api';
import { FiArrowLeft, FiArrowRight, FiX, FiCheck } from 'react-icons/fi';
import { useThemeStore } from '../store';
import '../assets/styles/InterviewSession.css';

/**
 * Icono SVG del micrófono para reconocimiento de voz.
 * Utiliza un icono animado que indica disponibilidad para grabación.
 * 
 * @function MicrophoneIcon
 * @returns {JSX.Element} Elemento SVG del icono de micrófono
 */
const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="interview-session__mic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

/**
 * Convierte segundos a formato legible MM:SS para mostrar en cronómetro.
 * Ejemplo: 125 segundos → "02:05", 5 segundos → "00:05"
 * 
 * @function formatTime
 * @param {number} seconds - Número entero de segundos a convertir (ej: 125)
 * @returns {string} Tiempo formateado como string "MM:SS" con ceros a la izquierda (ej: "02:05")
 * 
 * @example
 * formatTime(125) // Returns "02:05"
 * formatTime(5)   // Returns "00:05"
 * formatTime(3661) // Returns "61:01"
 */
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useThemeStore();

  // ========== Estados del Formulario ==========
  /** @type {[Object|null, Function]} Estado que almacena la entrevista cargada con todas sus preguntas y metadata */
  const [interview, setInterview] = useState(/** @type {Object|null} */ null);
  /** @type {[number, Function]} Índice (0-based) de la pregunta actual que se está mostrando */
  const [currentQuestion, setCurrentQuestion] = useState(/** @type {number} */ 0);
  /** @type {[boolean, Function]} Indica si se está cargando la entrevista desde el backend */
  const [loading, setLoading] = useState(/** @type {boolean} */ true);
  /** @type {[Object, Function]} Diccionario que almacena respuestas por ID de pregunta: { [questionId]: "respuesta de usuario" } */
  const [responses, setResponses] = useState(/** @type {Object} */ {});
  /** @type {[boolean, Function]} Indica si se está enviando respuesta o feedback al backend */
  const [submitting, setSubmitting] = useState(/** @type {boolean} */ false);

  // ========== Estados del Reconocimiento de Voz ==========
  /** @type {[boolean, Function]} True cuando micrófono está activo capturando audio */
  const [isListening, setIsListening] = useState(/** @type {boolean} */ false);
  /** @type {[boolean, Function]} True cuando hay transcripción de voz esperando confirmación del usuario */
  const [isConfirming, setIsConfirming] = useState(/** @type {boolean} */ false);
  /** @type {[string, Function]} Texto transcrito del reconocimiento de voz, antes de ser confirmado */
  const [userAnswer, setUserAnswer] = useState(/** @type {string} */ '');
  /** @type {[string, Function]} Mensaje de estado actual del micrófono ('escuchando', 'procesando', etc.) */
  const [voiceStatus, setVoiceStatus] = useState(''); 
  /** @type {[number, Function]} Tiempo transcurrido (en segundos) durante la grabación actual de voz */
  const [elapsedTime, setElapsedTime] = useState(/** @type {number} */ 0);
  /** @type {[number, Function]} Tiempo total (en segundos) desde inicio de la sesión de entrevista */
  const [totalTime, setTotalTime] = useState(/** @type {number} */ 0);

  // ========== Referencias ==========
  /** @type {React.MutableRefObject<SpeechRecognition|null>} Referencia a la instancia de Web Speech Recognition API */
  const recognitionRef = useRef(/** @type {SpeechRecognition|null} */ null);
  /** @type {React.MutableRefObject<string>} Buffer mutable para acumular texto transcrito sin causar re-renders */
  const userAnswerRef = useRef('');
  /** @type {React.MutableRefObject<NodeJS.Timeout|null>} ID del intervalo que actualiza totalTime cada segundo */
  const totalTimeIntervalRef = useRef(/** @type {NodeJS.Timeout|null} */ null);

  /**
   * Hook de inicialización: carga la entrevista cuando el componente monta o cambia el interviewId.
   * Este efecto es crítico para el ciclo de vida del componente.
   * 
   * @dependencies [interviewId] - Se ejecuta cuando el ID de entrevista cambia en la ruta
   * @sideEffects Llama a fetchInterview() que carga datos del backend y actualiza estados
   */
  useEffect(() => {
    fetchInterview();
    // eslint-disable-next-line
  }, [interviewId]);

  /**
   * Hook de inicialización: configura el reconocimiento de voz y el temporizador global.
   * Ejecutado una sola vez al montar el componente (effect de limpieza incluida).
   * 
   * @sideEffects
   * - Inicializa SpeechRecognition (W3C Web Speech API)
   * - Configura handlers: onresult (transcripción), onend (finalización), onerror
   * - Inicia intervalo que incrementa totalTime cada segundo
   * - Pausa el intervalo cuando el usuario finaliza la entrevista
   * 
   * @returns {Function} Cleanup function que detiene el intervalo y detiene el reconocimiento
   */
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

  /**
   * Temporizador para tiempo de grabación por pregunta.
   * Incrementa elapsedTime cada segundo mientras el micrófono está activo.
   * Se reinicia al cambiar de pregunta.
   * 
   * @dependencies [isListening] - Se ejecuta cuando se activa/desactiva el micrófono
   * @sideEffects Actualiza elapsedTime cada segundo durante grabación activa
   * @returns {Function} Cleanup function que detiene el intervalo
   */
  useEffect(() => {
    let answerTimer;
    if (isListening) {
      answerTimer = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(answerTimer);
  }, [isListening]);

  /**
   * Carga la entrevista completa desde el backend.
   * 
   * Realiza las siguientes operaciones:
   * 1. Obtiene datos de la entrevista con todas sus preguntas
   * 2. Si está "in_progress", restaura las respuestas previas guardadas
   * 3. Mapea las respuestas por índice de pregunta para rellenar el textarea
   * 4. Maneja errores y navega a /interviews si falla
   * 
   * @async
   * @returns {Promise<void>}
   * @sideEffects
   * - setLoading(true) → setLoading(false): Muestra/oculta spinner de carga
   * - setInterview(): Almacena la entrevista completa
   * - setResponses(): Restaura respuestas previas en formato { [questionIndex]: "text" }
   * - toast.error(): Muestra notificación si falla
   * - navigate('/interviews'): Redirige si hay error crítico
   * 
   * @example
   * // Se llama automáticamente en el useEffect al montar o cambiar interviewId
   * // También puede ser llamada manualmente para refrescar datos
   * await fetchInterview();
   */
  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await interviewService.getInterview(interviewId);
      const interviewData = response.data.interview;
      
      // Debug: ver qué datos llegan
      console.log('📊 Interview data:', interviewData);
      console.log('📊 Questions:', interviewData.questions);
      if (interviewData.questions && interviewData.questions.length > 0) {
        console.log('📊 First question responses:', interviewData.questions[0].responses);
        interviewData.questions.forEach((q, idx) => {
         console.log(`📊 Question ${idx + 1} has ${q?.responses?.length || 0} responses`);
        });
      }
      
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

  // Obtener la ÚLTIMA respuesta guardada (no la primera)
  const questionResponses = question?.responses || [];
  const lastResponse = questionResponses.length > 0 
    ? questionResponses[questionResponses.length - 1] 
    : null;
  const responseSaved = lastResponse?.responseText || '';
  const localResponse = responses[currentQuestion] || '';

  /**
   * Verifica si todas las preguntas tienen al menos una respuesta.
   * 
   * Evalúa tanto respuestas guardadas en el backend como respuestas temporales en el estado local:
   * - Para entrevistas completadas: verifica si hay respuesta guardada con texto no vacío
   * - Para entrevistas en progreso: verifica si hay respuesta temporal O guardada
   * 
   * @type {boolean}
   * @returns {boolean} true si todas las preguntas tienen respuesta, false si alguna está vacía
   */
  const allAnswered = questions.every((q, idx) => {
    if (isCompleted) {
      const qResponses = q?.responses || [];
      return qResponses.length > 0 && qResponses[qResponses.length - 1]?.responseText?.trim().length > 0;
    }
    const qResponses = q?.responses || [];
    const lastSaved = qResponses.length > 0 ? qResponses[qResponses.length - 1]?.responseText : null;
    const temp = responses[idx];
    return (temp && temp.trim().length > 0) || (lastSaved && lastSaved.trim().length > 0);
  });

  /**
   * Actualiza la respuesta temporal del usuario en el textarea.
   * Esta función NO envía a backend; solo actualiza el estado local (responses).
   * El guardado en backend ocurre cuando el usuario navega a otra pregunta o finaliza.
   * 
   * @function handleResponseChange
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Evento del textarea con el nuevo valor de texto
   * @sideEffects Actualiza state: responses[currentQuestion] = e.target.value
   * 
   * @example
   * // Usuario escribe en textarea → dispara onChange → handleResponseChange actualiza responses
   * <textarea onChange={handleResponseChange} value={responses[currentQuestion] || ''} />
   */
  const handleResponseChange = (e) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: e.target.value
    }));
  };

  /**
   * Envía la respuesta actual al backend y avanza automáticamente a la siguiente pregunta.
   * 
   * Proceso:
   * 1. Valida que haya texto en la respuesta
   * 2. Envía POST a backend con responseService.submitResponse
   * 3. Actualiza la UI refrescando datos de entrevista
   * 4. Limpia respuesta temporal del estado local
   * 5. Avanza a siguiente pregunta automáticamente
   * 6. Si es última pregunta, permanece en ella (el usuario debe hacer clic en "Finalizar")
   * 
   * @async
   * @function handleSaveResponse
   * @returns {Promise<void>}
   * @sideEffects
   * - POST /responses/submit (Backend)
   * - setSubmitting(true) → setSubmitting(false): Disable UI durante envío
   * - fetchInterview(): Actualiza interview y questions
   * - setResponses(): Limpia respuesta temporal guardada
   * - setCurrentQuestion(): Avanza a siguiente pregunta si no es última
   * - toast.*(): Muestra notificaciones (éxito/error/warning)
   * 
   * @throws {Error} Si la respuesta está vacía o el envío al backend falla
   * 
   * @example
   * // Usuario hace clic en "Siguiente" → handleSaveResponse envía respuesta al backend
   * <button onClick={handleSaveResponse} disabled={submitting}>Siguiente</button>
   */
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
      // Limpiar el estado temporal después de guardar
      setResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[currentQuestion];
        return newResponses;
      });
      
      // ✅ NUEVO: Avanzar automáticamente a la siguiente pregunta
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar respuesta');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Finaliza la entrevista completando todas las respuestas y generando feedback con IA.
   * 
   * Proceso de validación y finalización:
   * 1. Valida que todas las preguntas tengan al menos una respuesta
   * 2. Si hay preguntas sin responder, navega a la primera sin respuesta
   * 3. Si todas están respondidas:
   *    - Envía POST a backend para generar feedback con Google Gemini IA
   *    - Actualiza estado de entrevista a "completed"
   *    - Recarga datos de la entrevista para mostrar resultados
   * 4. Muestra notificaciones del progreso
   * 5. Maneja errores y muestra mensajes al usuario
   * 
   * @async
   * @function handleCompleteInterview
   * @returns {Promise<void>}
   * @sideEffects
   * - POST /responses/feedback (Backend: Genera feedback con IA)
   * - PUT /interviews/:id/status (Backend: Marca como completada)
   * - setSubmitting(true) → setSubmitting(false): Disable UI
   * - fetchInterview(): Recarga datos para mostrar resultados
   * - setCurrentQuestion(): Navega a primera pregunta sin respuesta si hay validación
   * - toast.*(): Notificaciones de progreso y errores
   * 
   * @throws {Error} Si falla la generación de feedback o actualización de estado
   * 
   * @example
   * // Usuario hace clic en "Finalizar entrevista" → valida → genera feedback → muestra resultados
   * <button onClick={handleCompleteInterview} disabled={submitting || !allAnswered}>
   *   Finalizar Entrevista
   * </button>
   */
  const handleCompleteInterview = async () => {
    // ✅ Verificar si hay preguntas sin responder
    const firstUnansweredIndex = questions.findIndex((q, idx) => {
      const qResponses = q?.responses || [];
      const lastSaved = qResponses.length > 0 ? qResponses[qResponses.length - 1]?.responseText : null;
      const temp = responses[idx];
      return !(temp && temp.trim().length > 0) && !(lastSaved && lastSaved.trim().length > 0);
    });

    // Si hay preguntas sin responder, navegar a la primera
    if (firstUnansweredIndex !== -1) {
      toast.warning(`Tienes preguntas sin responder. Ir a pregunta ${firstUnansweredIndex + 1}`);
      setCurrentQuestion(firstUnansweredIndex);
      return;
    }

    // Si todas están respondidas, generar feedback y completar
    try {
      setSubmitting(true);
      toast.info('⏳ Generando puntuaciones y feedback... Esto puede tomar 1-2 minutos.');
      
      // ✅ Generar feedback antes de completar
      try {
        await responseService.generateInterviewFeedback(interviewId);
      } catch (feedbackError) {
        // Si el error es timeout, mostrar mensaje más específico
        if (feedbackError.message && feedbackError.message.includes('timeout')) {
          toast.warning('⚠️ El servidor está procesando tu feedback. Si no ves resultados, por favor espera unos minutos.');
        } else {
          throw feedbackError;
        }
      }
      
      // Actualizar estado a completado
      await interviewService.updateInterviewStatus(interviewId, { status: 'completed' });
      
      toast.success('¡Entrevista completada! Puedes ver tus resultados en el listado de entrevistas.');
      
      // Redirigir al listado de entrevistas
      setTimeout(() => navigate('/interviews'), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al completar la entrevista';
      toast.error(errorMessage);
      console.error('Error completing interview:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Inicia o detiene la captura de voz mediante Web Speech API.
   * 
   * Comportamiento:
   * - Si está escuchando: Detiene el reconocimiento (llama a recognitionRef.current.stop())
   * - Si no está escuchando: Inicia nueva sesión de grabación
   *   - Limpia respuestas anteriores (userAnswer, elapsedTime)
   *   - Inicia nuevo proceso de reconocimiento (recognitionRef.current.start())
   *   - Actualiza UI (isListening = true, muestra "Escuchando...")
   * 
   * Nota: La parada y procesamiento de resultados es manejado por el evento onend
   * de recognitionRef.current configurado en el useEffect de inicialización.
   * 
   * @function handleListenToggle
   * @returns {void}
   * @sideEffects
   * - recognitionRef.current.start() o .stop(): Controla Web Speech API
   * - setUserAnswer(''): Limpia transcripción anterior
   * - setElapsedTime(0): Reinicia contador de tiempo de grabación
   * - setIsListening(true): Actualiza estado a escuchando
   * - setVoiceStatus(): Muestra estado del micrófono
   * 
   * @example
   * // Usuario hace clic en botón de micrófono
   * <button onClick={handleListenToggle} className={isListening ? 'active' : ''}>
   *   Micrófono
   * </button>
   */
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

  /**
   * Acepta la transcripción de voz y la transfiere al textarea.
   * 
   * Proceso:
   * 1. Valida que haya texto transcrito (no vacío)
   * 2. Asigna el texto de userAnswer al responses[currentQuestion]
   * 3. Limpia estados de confirmación (isConfirming = false, userAnswer = '')
   * 4. Reinicia cronómetro de grabación (elapsedTime = 0)
   * 5. Actualiza mensaje de estado
   * 
   * Nota: El texto confirmado NO se envía inmediatamente al backend.
   * Se envía cuando el usuario hace clic en "Siguiente" (handleSaveResponse).
   * 
   * @function handleConfirmAnswer
   * @returns {void}
   * @sideEffects
   * - setResponses(): Asigna userAnswer a responses[currentQuestion]
   * - setIsConfirming(false): Oculta botones de confirmación
   * - setUserAnswer(''): Limpia respuesta temporal de voz
   * - setElapsedTime(0): Reinicia contador
   * - setVoiceStatus(): Actualiza mensaje a usuario
   * 
   * @example
   * // Usuario dice algo, se transcribe, hace clic en "Confirmar"
   * <button onClick={handleConfirmAnswer} disabled={!userAnswer.trim()}>
   *   ✓ Confirmar
   * </button>
   */
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

  /**
   * Rechaza la transcripción de voz y permite reintentar.
   * 
   * Proceso:
   * 1. Oculta pantalla de confirmación (isConfirming = false)
   * 2. Limpia transcripción actual (userAnswer = '')
   * 3. Reinicia cronómetro (elapsedTime = 0)
   * 4. Muestra mensaje invitando a reintentar
   * 
   * El usuario puede hacer clic en el micrófono nuevamente para intentar otra grabación.
   * 
   * @function handleRetryAnswer
   * @returns {void}
   * @sideEffects
   * - setIsConfirming(false): Oculta confirmación
   * - setUserAnswer(''): Limpia transcripción
   * - setElapsedTime(0): Reinicia tiempo
   * - setVoiceStatus(): Muestra mensaje de reintentar
   * 
   * @example
   * // Usuario rechaza transcripción y hace clic en "Reintentar"
   * <button onClick={handleRetryAnswer}>
   *   ↺ Reintentar
   * </button>
   */
  const handleRetryAnswer = () => {
    setIsConfirming(false);
    setUserAnswer('');
    userAnswerRef.current = '';
    setElapsedTime(0);
    setVoiceStatus('Puedes empezar a grabar de nuevo cuando quieras.');
  };

  if (loading) {
    return (
      <div className="interview-session__loading">
        <div className="interview-session__loading-spinner"></div>
      </div>
    );
  }
  if (!interview || !questions.length) {
    return <div className={`interview-session__empty ${isDark ? 'interview-session__empty--dark' : ''}`}>{t('interview.noInterviews')}</div>;
  }

  // Si la entrevista está completada, mostrar vista de resultados completa
  if (isCompleted) {
    return (
      <div className={`interview-session ${isDark ? 'interview-session--dark' : ''}`}>
        <div className="interview-session__container interview-session__container--full">
          <div className="interview-session__header">
            <div className="interview-session__title-row">
              <h1 className={`interview-session__title ${isDark ? 'interview-session__title--dark' : ''}`}>
                {interview?.title}
              </h1>
              <button
                onClick={() => navigate('/interviews')}
                className="interview-session__exit-button"
              >
                <FiX /> {t('interview.exit')}
              </button>
            </div>
            <p className={`interview-session__subtitle ${isDark ? 'interview-session__subtitle--dark' : ''}`}>
              Resultados de la entrevista - {questions.length} preguntas
            </p>
          </div>

          <div className={`interview-session__results-container ${isDark ? 'interview-session__results-container--dark' : ''}`}>
            {questions.map((q, idx) => {
              const allResponses = q?.responses || [];
              return (
                <div key={idx} className={`interview-session__result-card ${isDark ? 'interview-session__result-card--dark' : ''}`}>
                  <div className="interview-session__result-header">
                    <span className="interview-session__result-number">{idx + 1}</span>
                    <div className="interview-session__result-info">
                      <h3 className={`interview-session__result-question ${isDark ? 'interview-session__result-question--dark' : ''}`}>
                        {q?.questionText || q?.question}
                      </h3>
                      <span className={`interview-session__result-difficulty ${isDark ? 'interview-session__result-difficulty--dark' : ''}`}>
                        {t('interview.difficulty')}: {q?.difficulty || 'unknown'}
                      </span>
                    </div>
                  </div>
                  
                  {allResponses.length === 0 ? (
                    <div className={`interview-session__result-answer ${isDark ? 'interview-session__result-answer--dark' : ''}`}>
                      <span className="interview-session__no-response">{t('interview.noResponse')}</span>
                    </div>
                  ) : (
                    <div className="interview-session__result-responses">
                      {allResponses.map((resp, respIdx) => (
                        <div key={respIdx} className={`interview-session__result-answer ${isDark ? 'interview-session__result-answer--dark' : ''}`}>
                          <div className="interview-session__result-answer-header">
                            <span className="interview-session__response-badge">Respuesta {respIdx + 1}</span>
                            {resp?.score !== undefined && (
                              <span className={`interview-session__score-badge ${resp.score >= 70 ? 'interview-session__score-badge--good' : resp.score >= 50 ? 'interview-session__score-badge--medium' : 'interview-session__score-badge--low'}`}>
                                {resp.score}/100
                              </span>
                            )}
                          </div>
                          <p className="interview-session__result-text">{resp?.responseText || <span className="interview-session__no-response">{t('interview.noResponse')}</span>}</p>
                          {resp?.feedback && (
                            <div className={`interview-session__feedback ${isDark ? 'interview-session__feedback--dark' : ''}`}>
                              <strong>Feedback:</strong> {resp.feedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Vista normal para entrevista en progreso
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`interview-session ${isDark ? 'interview-session--dark' : ''}`}>
      <div className="interview-session__container">
        <div className="interview-session__header">
          <div className="interview-session__title-row">
            <h1 className={`interview-session__title ${isDark ? 'interview-session__title--dark' : ''}`}>
              {interview?.title}
            </h1>
            <span className={`interview-session__question-counter ${isDark ? 'interview-session__question-counter--dark' : ''}`}>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className={`interview-session__progress-track ${isDark ? 'interview-session__progress-track--dark' : ''}`}>
            <div
              className="interview-session__progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className={`interview-session__card ${isDark ? 'interview-session__card--dark' : ''}`}>
          <div className="interview-session__question-header">
            <div className="interview-session__question-number">
              {currentQuestion + 1}
            </div>
            <p className={`interview-session__question-difficulty ${isDark ? 'interview-session__question-difficulty--dark' : ''}`}>
              {t('interview.difficulty')}: {question?.difficulty || 'unknown'}
            </p>
          </div>

          <h2 className={`interview-session__question-text ${isDark ? 'interview-session__question-text--dark' : ''}`}>
            {question?.questionText || question?.question || 'Question not found'}
          </h2>

          <div className="interview-session__answer-section">
            <label className={`interview-session__answer-label ${isDark ? 'interview-session__answer-label--dark' : ''}`}>
              {t('interview.answer')}
            </label>

            {isCompleted ? (
              // Este bloque ya no se usa, la vista completa está arriba
              null
            ) : isInProgress ? (
              <div>
                {/* Mostrar última respuesta guardada si existe */}
                {responseSaved && (
                  <div className={`interview-session__last-response ${isDark ? 'interview-session__last-response--dark' : ''}`}>
                    <p className="interview-session__last-response-title">Última respuesta enviada:</p>
                    <p className="interview-session__last-response-text">{responseSaved}</p>
                  </div>
                )}

                {/* Área de entrada con reconocimiento de voz o textarea */}
                {isConfirming ? (
                  <div className={`interview-session__confirming-box ${isDark ? 'interview-session__confirming-box--dark' : ''}`}>
                    <p className="interview-session__confirming-title">{t('interview.pendingConfirmation')}</p>
                    <p className="interview-session__confirming-text">{userAnswer}</p>
                  </div>
                ) : (
                  <div className="interview-session__textarea-wrapper">
                    <textarea
                      value={localResponse || userAnswer}
                      onChange={handleResponseChange}
                      disabled={isListening || submitting}
                      className={`interview-session__textarea ${isDark ? 'interview-session__textarea--dark' : ''}`}
                      rows="6"
                      placeholder={t('interview.unansweredQuestion')}
                    />
                    <button
                      onClick={handleListenToggle}
                      disabled={submitting}
                      className={`interview-session__mic-button-inside ${isListening ? 'interview-session__mic-button-inside--listening' : ''}`}
                      title={isListening ? t('interview.stop') : t('interview.record')}
                    >
                      <MicrophoneIcon />
                    </button>
                  </div>
                )}

                {/* Estado del reconocimiento de voz */}
                {voiceStatus && (
                  <div className={`interview-session__voice-status ${isDark ? 'interview-session__voice-status--dark' : ''}`}>
                    {voiceStatus}
                  </div>
                )}

                {/* Tiempos */}
                {(isListening || isConfirming) && (
                  <div className={`interview-session__timers ${isDark ? 'interview-session__timers--dark' : ''}`}>
                    <span>{t('interview.responseTime')}: {formatTime(elapsedTime)}</span>
                    <span>{t('interview.totalTime')}: {formatTime(totalTime)}</span>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="interview-session__actions">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={handleRetryAnswer}
                        className="interview-session__button interview-session__button--retry"
                      >
                        {t('interview.retryAnswer')}
                      </button>
                      <button
                        onClick={handleConfirmAnswer}
                        className="interview-session__button interview-session__button--confirm"
                      >
                        {t('interview.confirmAnswer')}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveResponse}
                      disabled={submitting || localResponse.trim().length === 0}
                      className="interview-session__button interview-session__button--save"
                    >
                      {t('interview.saveResponse')}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/**
           * Sección de navegación entre preguntas.
           * Muestra botones para ir a pregunta anterior/siguiente según posición actual.
           * 
           * Lógica:
           * - Botón "Anterior" aparece si currentQuestion > 0
           * - Botón "Siguiente" aparece si currentQuestion < últimaPreg
           * - En última pregunta, desaparece "Siguiente" y aparece "Finalizar"
           * 
           * Nota: Los clics en navegación NO guardan respuesta. El usuario debe hacer
           * clic en "Siguiente" para guardar. Esta navegación es solo para moverse rápido
           * sin guardar (solo cambia visualización de pregunta en UI).
           * 
           * Botones inline:
           * - onClick={() => setCurrentQuestion(currentQuestion - 1)} → Va a pregunta anterior
           * - onClick={() => setCurrentQuestion(currentQuestion + 1)} → Va a pregunta siguiente
           */}
          <div className="interview-session__nav">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className={`interview-session__nav-button ${isDark ? 'interview-session__nav-button--dark' : ''}`}
              >
                <FiArrowLeft /> {t('interview.previousQuestion')}
              </button>
            )}
            {currentQuestion < questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className={`interview-session__nav-button ${isDark ? 'interview-session__nav-button--dark' : ''}`}
              >
                {t('interview.nextQuestion')} <FiArrowRight />
              </button>
            )}
          </div>

          {/**
           * Botón para completar la entrevista.
           * 
           * Visibilidad: Solo aparece en la última pregunta (currentQuestion === questions.length - 1)
           * 
           * Estados del botón:
           * 1. Todas respondidas: "✓ Finalizar Entrevista" - Habilitado
           *    - onClick={handleCompleteInterview} genera feedback con IA
           * 
           * 2. Hay sin responder: "! Responde todas las preguntas" - Deshabilitado
           *    - Muestra tooltip indicando que faltan respuestas
           * 
           * Comportamiento al hacer clic:
           * - handleCompleteInterview() valida respuestas faltantes
           * - Si hay sin responder: navega a la primera sin responder
           * - Si todas respondidas: genera feedback con Google Gemini y marca completada
           * 
           * @component Botón inline condicional
           * @disabled {boolean} submitting OR !allAnswered
           */}
          {currentQuestion === questions.length - 1 && isInProgress && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleCompleteInterview}
                disabled={submitting}
                className="interview-session__complete-button"
                title={allAnswered ? 'Completar y enviar entrevista' : 'Haz clic para ir a las preguntas sin responder'}
              >
                {allAnswered ? (
                  <>
                    <FiCheck /> {t('interview.completeInterview')}
                  </>
                ) : (
                  <>
                    <FiX /> Faltan preguntas por responder ({questions.filter((q, idx) => {
                      const qResponses = q?.responses || [];
                      const lastSaved = qResponses.length > 0 ? qResponses[qResponses.length - 1]?.responseText : null;
                      const temp = responses[idx];
                      return (temp && temp.trim().length > 0) || (lastSaved && lastSaved.trim().length > 0);
                    }).length}/{questions.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;