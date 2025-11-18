import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const interviewService = {
  generateQuestions: (data) => api.post('/interviews/generate-questions', data),
  createInterview: (data) => api.post('/interviews', data),
  getInterviews: () => api.get('/interviews'),
  getInterview: (id) => api.get(`/interviews/${id}`),
  updateInterviewStatus: (id, data) => api.put(`/interviews/${id}/status`, data),
  deleteInterview: (id) => api.delete(`/interviews/${id}`)
};

export const responseService = {
  submitResponse: (data) => api.post('/responses', data),
  getResponses: (interviewId) => api.get(`/responses/interview/${interviewId}`),
  getResponse: (id) => api.get(`/responses/${id}`),
  updateResponse: (id, data) => api.put(`/responses/${id}`, data)
};

export const statsService = {
  getUserStats: () => api.get('/stats'),
  getInterviewStats: (id) => api.get(`/stats/interview/${id}`),
  getPerformanceTrends: () => api.get('/stats/trends')
};

export const subscriptionService = {
  createPayment: (data) => api.post('/subscriptions/create-payment', data),
  executePayment: (data) => api.post('/subscriptions/execute-payment', data),
  getSubscription: () => api.get('/subscriptions'),
  checkPremiumAccess: () => api.get('/subscriptions/premium/check'),
  cancelSubscription: () => api.delete('/subscriptions')
};

export const aiService = {
  transcribeAudio: (data) => api.post('/ai/transcribe', data),
  getNextQuestion: (data) => api.post('/ai/next-question', data),
  evaluateResponse: (data) => api.post('/ai/evaluate-response', data)
};
