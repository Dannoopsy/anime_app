import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/api";
const ReviewForm = ({ animeId, onReviewSubmitted }) => {
    const { user } = useContext(AuthContext);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError("Вы должны быть авторизованы для оставления отзыва.");
            return;
        }

        if (!text || rating === 0) {
            setError("Пожалуйста, напишите отзыв и выберите оценку.");
            return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("Ошибка авторизации. Перезайдите в аккаунт.");
            return;
        }

        setLoading(true);

        try {
            await api.post(`/anime/${animeId}/add_review/`, { text, rating });
            setText("");
            setRating(0);
            setError(null);
            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.error || "Ошибка при отправке отзыва.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h3>Оставить отзыв</h3>
            {error && <p style={styles.error}>{error}</p>}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите ваш отзыв..."
                style={styles.textarea}
            />
            <div style={styles.rating}>
                {[...Array(10)].map((_, i) => (
                    <span
                        key={i + 1}
                        style={i < rating ? styles.starFilled : styles.star}
                        onClick={() => setRating(i + 1)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Отправка..." : "Оставить отзыв"}
            </button>
        </form>
    );
};

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
    },
    textarea: {
        height: "80px",
        padding: "10px",
        borderRadius: "5px",
        resize: "none",
    },
    rating: {
        display: "flex",
        gap: "5px",
        fontSize: "20px",
        cursor: "pointer",
    },
    star: {
        color: "gray",
    },
    starFilled: {
        color: "gold",
    },
    button: {
        padding: "10px",
        backgroundColor: "#f39c12",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        color: "#fff",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: "14px",
    },
};

export default ReviewForm;
