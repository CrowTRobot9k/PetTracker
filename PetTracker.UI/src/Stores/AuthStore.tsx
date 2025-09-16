import { create } from "zustand";
import { User } from '../Types/SharedTypes';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    initializeAuth: () => void;
    checkAuth: () => Promise<boolean>;
}

// localStorage keys
const AUTH_STORAGE_KEY = 'petTracker_auth';
const USER_STORAGE_KEY = 'petTracker_user';

// Utility functions for localStorage
const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

const getFromStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return null;
    }
};

const removeFromStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to remove from localStorage:', error);
    }
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
        saveToStorage(AUTH_STORAGE_KEY, true);
        saveToStorage(USER_STORAGE_KEY, user);
    },

    logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
        removeFromStorage(AUTH_STORAGE_KEY);
        removeFromStorage(USER_STORAGE_KEY);
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    initializeAuth: () => {
        const isAuth = getFromStorage(AUTH_STORAGE_KEY);
        const user = getFromStorage(USER_STORAGE_KEY);
        
        if (isAuth && user) {
            set({ 
                isAuthenticated: true, 
                user: user as User,
                isLoading: false 
            });
        } else {
            set({ 
                isAuthenticated: false, 
                user: null, 
                isLoading: false 
            });
        }
    },

    checkAuth: async () => {
        const { isAuthenticated } = get();
        
        // If already authenticated via localStorage, return true
        if (isAuthenticated) {
            return true;
        }

        // If not authenticated, try to verify with server
        set({ isLoading: true, error: null });
        
        try {
            const response = await fetch("/getauth", {
                method: "GET",
            });

            if (response.status === 200) {
                const userData = await response.json();
                const user: User = {
                    id: userData.id || '',
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    fullName: userData.fullName || '',
                    userName: userData.userName || '',
                    email: userData.email || '',
                    company: userData.company || null,
                    roleNames: userData.roleNames || [],
                    roles: userData.roles || []
                };
                
                get().login(user);
                return true;
            } else if (response.status === 401) {
                get().logout();
                return false;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            get().setError('Authentication check failed');
            get().logout();
            return false;
        } finally {
            get().setLoading(false);
        }
    }
}));

