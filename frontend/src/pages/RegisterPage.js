import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        avatar: null,
        bio: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const form = new FormData();
        for (const key in formData) {
            if (formData[key]) form.append(key, formData[key]);
        }

        try {
            const response = await api.post("/auth/register/", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setSuccess("Регистрация успешна! Переход на страницу входа...");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err) {
            setError("Ошибка регистрации. Возможно, имя пользователя уже занято.");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Регистрация</h2>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <input
                    type="text"
                    name="username"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password2"
                    placeholder="Повторите пароль"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <textarea
                    name="bio"
                    placeholder="О себе (необязательно)"
                    value={formData.bio}
                    onChange={handleChange}
                    style={styles.textarea}
                />
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    style={styles.fileInput}
                />
                <button type="submit" style={styles.button}>
                    Зарегистрироваться
                </button>
            </form>
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
    form: {
        backgroundColor: "#1e1e1e",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        color: "#fff",
    },
    title: {
        textAlign: "center",
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        backgroundColor: "#333",
        color: "#fff",
    },
    textarea: {
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        backgroundColor: "#333",
        color: "#fff",
        resize: "none",
        height: "80px",
    },
    fileInput: {
        backgroundColor: "#333",
        color: "#fff",
        padding: "5px",
        borderRadius: "5px",
    },
    button: {
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        backgroundColor: "#6200ea",
        color: "white",
        cursor: "pointer",
        transition: "background 0.3s",
    },
    buttonHover: {
        backgroundColor: "#3700b3",
    },
    error: {
        color: "#ff5252",
        fontSize: "14px",
    },
    success: {
        color: "#4caf50",
        fontSize: "14px",
    },
};

export default RegisterPage;
