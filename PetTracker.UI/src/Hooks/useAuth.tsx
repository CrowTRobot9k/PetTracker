import { useAuthStore } from '../Stores/AuthStore';

/**
 * Custom hook to access authentication state and actions
 * This provides a clean interface for components to interact with authentication
 */
export const useAuth = () => {
    const authStore = useAuthStore();
    
    return {
        // State
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        isLoading: authStore.isLoading,
        error: authStore.error,
        
        // Actions
        login: authStore.login,
        logout: authStore.logout,
        checkAuth: authStore.checkAuth,
        initializeAuth: authStore.initializeAuth,
        
        // Computed properties
        isLoggedIn: authStore.isAuthenticated && authStore.user !== null,
        userEmail: authStore.user?.email || '',
        userName: authStore.user?.fullName || authStore.user?.userName || '',
    };
};
