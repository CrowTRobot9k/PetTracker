import { create } from "zustand";
import { User } from '../Types/SharedTypes';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isLoggingOut: boolean;
    sessionCheckInterval: NodeJS.Timeout | null;
    
    // Actions
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setLoggingOut: (loggingOut: boolean) => void;
    initializeAuth: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    startSessionValidation: () => void;
    stopSessionValidation: () => void;
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
    isLoggingOut: false,
    sessionCheckInterval: null,

    login: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
        saveToStorage(AUTH_STORAGE_KEY, true);
        saveToStorage(USER_STORAGE_KEY, user);
        
        // Start periodic session validation
        get().startSessionValidation();
    },

    logout: () => {
        // Stop session validation
        get().stopSessionValidation();
        
        set({ user: null, isAuthenticated: false, error: null, isLoggingOut: false });
        removeFromStorage(AUTH_STORAGE_KEY);
        removeFromStorage(USER_STORAGE_KEY);
    },

    setLoggingOut: (loggingOut: boolean) => {
        set({ isLoggingOut: loggingOut });
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    initializeAuth: async () => {
        const isAuth = getFromStorage(AUTH_STORAGE_KEY);
        const user = getFromStorage(USER_STORAGE_KEY);
        
        // Always validate with server, even if we have local auth data
        if (isAuth && user) {
            set({ 
                isAuthenticated: true, 
                user: user as User,
                isLoading: true // Set loading while we validate
            });
            
            // Validate with server
            const isValid = await get().checkAuth();
            if (!isValid) {
                // Server says we're not authenticated, clear local state
                get().logout();
            }
        } else {
            set({ 
                isAuthenticated: false, 
                user: null, 
                isLoading: false 
            });
        }
    },

    checkAuth: async () => {
        // Always verify with server, regardless of local state
        set({ isLoading: true, error: null });
        
        try {
            const response = await fetch("/getauth", {
                method: "GET",
                credentials: 'include' // Ensure cookies are sent
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
                
                // Update local state with fresh server data
                get().login(user);
                return true;
            } else if (response.status === 401 || response.status === 404) {
                // Server says we're not authenticated
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
    },

    startSessionValidation: () => {
        const { sessionCheckInterval } = get();
        
        // Clear existing interval if any
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
        }
        
        // Start new interval - check every 5 minutes
        const interval = setInterval(async () => {
            const { isAuthenticated } = get();
            if (isAuthenticated) {
                console.log('Performing periodic session validation...');
                await get().checkAuth();
            }
        }, 5 * 60 * 1000); // 5 minutes
        
        set({ sessionCheckInterval: interval });
    },

    stopSessionValidation: () => {
        const { sessionCheckInterval } = get();
        
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
            set({ sessionCheckInterval: null });
        }
    }
}));

