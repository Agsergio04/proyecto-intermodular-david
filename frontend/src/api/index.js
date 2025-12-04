import { create } from 'zustand';


export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,


  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),


  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),


  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  }
}));


export const useInterviewStore = create((set) => ({
  interviews: [],
  currentInterview: null,
  isLoading: false,
  error: null,


  setInterviews: (interviews) => set({ interviews }),
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  addInterview: (interview) => set((state) => ({
    interviews: [interview, ...state.interviews]
  })),
  updateInterview: (id, updates) => set((state) => ({
    interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i),
    currentInterview: state.currentInterview?.id === id ? { ...state.currentInterview, ...updates } : state.currentInterview
  })),
  removeInterview: (id) => set((state) => ({
    interviews: state.interviews.filter(i => i.id !== id)
  })),


  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));


export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
 
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


  initializeTheme: () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    set({ isDark });
  }
}));


export const useLanguageStore = create((set) => ({
  language: localStorage.getItem('language') || 'en',
 
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },


  initializeLanguage: () => {
    const language = localStorage.getItem('language') || 'en';
    set({ language });
  }
}));


export const useSubscriptionStore = create((set) => ({
  subscription: null,
  isPremium: false,
  isLoading: false,
  error: null,


  setSubscription: (subscription) => set({ subscription }),
  setIsPremium: (isPremium) => set({ isPremium }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));
