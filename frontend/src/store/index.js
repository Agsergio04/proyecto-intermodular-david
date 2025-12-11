/**
 * Stores de Zustand para gestionar el estado global de la aplicación.
 * Incluye autenticación, entrevistas, tema, idioma y suscripciones.
 * 
 * @module stores
 */

import { create } from 'zustand';

/**
 * Store de autenticación del usuario.
 * Gestiona usuario, token, loading y errores de autenticación.
 * 
 * @type {import('zustand').Store<{
 *   user: Object|null,
 *   token: string|null,
 *   isLoading: boolean,
 *   error: string|null,
 *   setUser: (user: Object) => void,
 *   setToken: (token: string) => void,
 *   setLoading: (isLoading: boolean) => void,
 *   setError: (error: string) => void,
 *   login: (user: Object, token: string) => void,
 *   logout: () => void,
 *   initializeAuth: () => void
 * }>}
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  /** Establece el usuario autenticado */
  setUser: (user) => set({ user }),
  
  /** Establece el token JWT */
  setToken: (token) => set({ token }),
  
  /** Establece estado de loading */
  setLoading: (isLoading) => set({ isLoading }),
  
  /** Establece mensaje de error */
  setError: (error) => set({ error }),

  /** Login completo: usuario + token */
  login: (user, token) => set({ user, token }),
  
  /** Logout: limpia usuario y token */
  logout: () => set({ user: null, token: null }),

  /**
   * Inicializa autenticación desde localStorage.
   * Recupera token y usuario persistidos.
   */
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  }
}));

/**
 * Store de entrevistas.
 * Gestiona lista de entrevistas, entrevista actual y operaciones CRUD.
 * 
 * @type {import('zustand').Store<{
 *   interviews: Array<Object>,
 *   currentInterview: Object|null,
 *   isLoading: boolean,
 *   error: string|null,
 *   setInterviews: (interviews: Array<Object>) => void,
 *   setCurrentInterview: (interview: Object) => void,
 *   addInterview: (interview: Object) => void,
 *   updateInterview: (id: string, updates: Object) => void,
 *   removeInterview: (id: string) => void,
 *   setLoading: (isLoading: boolean) => void,
 *   setError: (error: string) => void
 * }>}
 */
export const useInterviewStore = create((set) => ({
  interviews: [],
  currentInterview: null,
  isLoading: false,
  error: null,

  /** Establece lista completa de entrevistas */
  setInterviews: (interviews) => set({ interviews }),
  
  /** Establece entrevista actual */
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  
  /** Añade nueva entrevista al inicio de la lista */
  addInterview: (interview) => set((state) => ({
    interviews: [interview, ...state.interviews]
  })),
  
  /**
   * Actualiza entrevista por ID en lista y currentInterview.
   * @param {string} id - ID de la entrevista
   * @param {Object} updates - Campos a actualizar
   */
  updateInterview: (id, updates) => set((state) => ({
    interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i),
    currentInterview: state.currentInterview?.id === id ? { ...state.currentInterview, ...updates } : state.currentInterview
  })),
  
  /** Elimina entrevista por ID de la lista */
  removeInterview: (id) => set((state) => ({
    interviews: state.interviews.filter(i => i.id !== id)
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

/**
 * Store de tema oscuro/claro.
 * Persiste preferencia en localStorage y aplica clase 'dark' al HTML.
 */
export const useThemeStore = create((set) => ({
  /** Estado inicial desde localStorage */
  isDark: localStorage.getItem('theme') === 'dark',
  
  /**
   * Alterna tema y persiste en localStorage.
   * Aplica/quita clase 'dark' al documentElement.
   */
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDark: newIsDark };
  }),

  /**
   * Inicializa tema desde localStorage y aplica clase CSS.
   */
  initializeTheme: () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    set({ isDark });
  }
}));

/**
 * Store de idioma.
 * Persiste idioma en localStorage con 'en' por defecto.
 */
export const useLanguageStore = create((set) => ({
  /** Estado inicial desde localStorage o 'en' por defecto */
  language: localStorage.getItem('language') || 'en',
  
  /**
   * Cambia idioma y persiste en localStorage.
   * @param {string} language - Código del idioma ('en', 'es', etc.)
   */
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },

  /**
   * Inicializa idioma desde localStorage.
   */
  initializeLanguage: () => {
    const language = localStorage.getItem('language') || 'en';
    set({ language });
  }
}));

/**
 * Store de suscripción.
 * Gestiona estado premium, suscripción activa y loading/errors.
 */
export const useSubscriptionStore = create((set) => ({
  subscription: null,
  isPremium: false,
  isLoading: false,
  error: null,

  /** Establece datos de suscripción */
  setSubscription: (subscription) => set({ subscription }),
  
  /** Establece estado premium */
  setIsPremium: (isPremium) => set({ isPremium }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));
