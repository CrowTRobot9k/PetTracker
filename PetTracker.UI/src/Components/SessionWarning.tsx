import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../Stores/AuthStore';

interface SessionWarningProps {
    onExtendSession: () => void;
    onLogout: () => void;
}

export default function SessionWarning({ onExtendSession, onLogout }: SessionWarningProps) {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            setShowWarning(false);
            return;
        }

        // Check session every 4 minutes (1 minute before the 5-minute validation)
        const checkInterval = setInterval(async () => {
            try {
                const response = await fetch('/getauth', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.status === 401) {
                    // Session expired, show warning
                    setShowWarning(true);
                    setTimeLeft(30); // 30 seconds to respond
                    
                    // Countdown timer
                    const countdown = setInterval(() => {
                        setTimeLeft(prev => {
                            if (prev <= 1) {
                                clearInterval(countdown);
                                onLogout();
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            } catch (error) {
                console.error('Session check failed:', error);
            }
        }, 4 * 60 * 1000); // Check every 4 minutes

        return () => clearInterval(checkInterval);
    }, [isAuthenticated, onLogout]);

    const handleExtendSession = async () => {
        try {
            const response = await fetch('/getauth', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                setShowWarning(false);
                onExtendSession();
            } else {
                onLogout();
            }
        } catch (error) {
            console.error('Failed to extend session:', error);
            onLogout();
        }
    };

    if (!showWarning) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <strong>Session Expiring Soon!</strong>
                <br />
                Your session will expire in {timeLeft} seconds. 
                <button 
                    onClick={handleExtendSession}
                    style={{
                        marginLeft: '10px',
                        padding: '5px 15px',
                        backgroundColor: 'white',
                        color: '#ff6b6b',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Extend Session
                </button>
                <button 
                    onClick={onLogout}
                    style={{
                        marginLeft: '5px',
                        padding: '5px 15px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
