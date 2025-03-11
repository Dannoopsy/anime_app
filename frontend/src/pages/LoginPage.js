import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password, navigate);
        } catch (err) {
            setError("Ошибка входа. Проверьте логин и пароль.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Вход</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Логин"
                        style={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Войти</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212",
    },
    card: {
        backgroundColor: "#1e1e1e",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        width: "300px",
    },
    title: {
        color: "#fff",
        marginBottom: "15px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #333",
        borderRadius: "4px",
        backgroundColor: "#252525",
        color: "#fff",
    },
    button: {
        padding: "10px",
        backgroundColor: "#6200ea",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    error: {
        color: "#ff4444",
        marginBottom: "10px",
    },
};

export default LoginPage;
