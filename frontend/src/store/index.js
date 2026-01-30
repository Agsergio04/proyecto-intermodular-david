/**
 * Zustand stores for global application state.
 * Includes authentication, interviews, theme, language and subscription stores.
 *
 * @module stores
 */

import { create } from 'zustand';

/**
 * Authentication store.
 * Manages user object, JWT token, loading state and auth errors.
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

  /** Set authenticated user */
  setUser: (user) => set({ user }),

  /** Set JWT token */
  setToken: (token) => set({ token }),

  /** Set loading state */
  setLoading: (isLoading) => set({ isLoading }),

  /** Set error message */
  setError: (error) => set({ error }),

  /** Full login: set user and token */
  login: (user, token) => set({ user, token }),

  /** Logout: clear user and token */
  logout: () => set({ user: null, token: null }),

  /**
   * Initialize authentication from localStorage.
   * Restores token and persisted user.
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
 * Interview store.
 * Manages a list of interviews, the current interview and CRUD helpers.
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

  /** Set full interviews list */
  setInterviews: (interviews) => set({ interviews }),

  /** Set current interview */
  setCurrentInterview: (interview) => set({ currentInterview: interview }),

  /** Add a new interview at the beginning of the list */
  addInterview: (interview) => set((state) => ({
    interviews: [interview, ...state.interviews]
  })),

  /**
   * Update an interview by ID in the list and currentInterview.
   * @param {string} id - Interview ID
   * @param {Object} updates - Fields to update
   */
  updateInterview: (id, updates) => set((state) => ({
    interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i),
    currentInterview: state.currentInterview?.id === id ? { ...state.currentInterview, ...updates } : state.currentInterview
  })),

  /** Remove interview by ID from the list */
  removeInterview: (id) => set((state) => ({
    interviews: state.interviews.filter(i => i.id !== id)
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

/**
 * Theme store (dark / light).
 * Persists preference in localStorage and applies the 'dark' class to the HTML element.
 */
export const useThemeStore = create((set) => ({
  /** Initial state loaded from localStorage */
  isDark: localStorage.getItem('theme') === 'dark',

  /**
   * Toggle theme and persist in localStorage.
   * Adds/removes the 'dark' class on the documentElement.
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
   * Initialize theme from localStorage and apply CSS class.
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
 * Language store.
 * Persists language in localStorage with 'en' as default.
 */
export const useLanguageStore = create((set) => ({
  /** Initial state from localStorage or 'en' by default */
  language: localStorage.getItem('language') || 'en',

  /**
   * Set language and persist in localStorage.
   * @param {string} language - Language code ('en', 'es', etc.)
   */
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },

  /** Initialize language from localStorage. */
  initializeLanguage: () => {
    const language = localStorage.getItem('language') || 'en';
    set({ language });
  }
}));

/**
 * Subscription store.
 * Manages premium flag, subscription data and loading/errors.
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
