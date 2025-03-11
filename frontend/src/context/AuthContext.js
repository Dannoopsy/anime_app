import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetch("http://127.0.0.1:8000/api/auth/user/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setUser(data))
                .catch(() => logout());
        }
    }, []);

    const login = async (username, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            setUser({ username });
            navigate("/");
        } else {
            alert("Ошибка входа");
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/login"); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
