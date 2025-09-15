
import { useNavigate } from "react-router";
import { useAuthStore } from '../Stores/AuthStore';

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // Clear localStorage and update store immediately
        logout();
        
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        })
            .then((data) => {
                if (data.ok) {
                    navigate("/signin");
                } else {
                    // Even if server logout fails, we've already cleared local state
                    navigate("/signin");
                }
            })
            .catch((error) => {
                console.error(error);
                // Even if server logout fails, we've already cleared local state
                navigate("/signin");
            });
    };

    return (
        <>
            <a href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;
