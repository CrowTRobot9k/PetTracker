// Global fetch interceptor to handle 401 responses
let isHandling401 = false;

const originalFetch = window.fetch;

window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Handle 401 Unauthorized responses globally
    if (response.status === 401 && !isHandling401) {
        isHandling401 = true;
        
        try {
            // Import auth store dynamically to avoid circular dependencies
            const { useAuthStore } = await import('../Stores/AuthStore');
            const authStore = useAuthStore.getState();
            
            // Only logout if we think we're authenticated
            if (authStore.isAuthenticated) {
                console.log('Received 401 response, logging out user...');
                authStore.logout();
                
                // Redirect to signin page
                window.location.href = '/signin';
            }
        } catch (error) {
            console.error('Error handling 401 response:', error);
        } finally {
            isHandling401 = false;
        }
    }
    
    return response;
};

export {};
