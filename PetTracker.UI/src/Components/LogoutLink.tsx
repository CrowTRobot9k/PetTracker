
import { useNavigate } from "react-router";
import { useAuthStore } from '../Stores/AuthStore';

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { logout, setLoggingOut } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // Set logging out state to prevent AuthorizeView from redirecting
        setLoggingOut(true);
        
        try {
            // Wait for server logout to complete before clearing local state
            await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: ""
            });
            
            // Clear localStorage and update store after server logout
            logout();
            
            // Navigate to signin after server logout completes
            navigate("/signin");
        } catch (error) {
            console.error("Server logout failed:", error);
            // Clear local state and navigate even if server logout fails
            logout();
            navigate("/signin");
        }
    };

    return (
        <>
            <a href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;
