import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AnimeHistogram from "../components/AnimeHistogram";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import api from "../api/api";

const AnimeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [anime, setAnime] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get(`/anime/${id}/`)
            .then((response) => setAnime(response.data))
            .catch((error) => console.error("Ошибка загрузки аниме:", error));

        api.get(`/anime/${id}/reviews/`)
            .then((response) => setReviews(response.data))
            .catch((error) => console.error("Ошибка загрузки отзывов:", error));
    }, [id]);

    if (!anime) return <div>Загрузка...</div>;

    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    ← Назад
                </button>
                <h1 style={{ flexGrow: 1 }}>{anime.title}</h1>
                <div style={styles.userBox}>
                    {user ? (
                        <>
                            <Link to={`/users/${user.username}`} style={styles.username}>
                                {user.username}
                            </Link>
                            <button onClick={logout} style={styles.logoutButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <div style={styles.authButtons}>
                            <Link to="/login" style={styles.loginButton}>Войти</Link>
                            <Link to="/register" style={styles.registerButton}>Регистрация</Link>
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.mainContent}>
                
                <div style={styles.leftColumn}>
                    <img src={`http://127.0.0.1:8000${anime.posters}`} alt={anime.title} style={styles.poster} />
                </div>

                
                <div style={styles.infoBox}>
                    <h3>Информация</h3>
                    <p><strong>Эпизоды:</strong> {anime.episodes}</p>
                    <p><strong>Дата выхода:</strong> {anime.release_date}</p>
                    <p><strong>Тип:</strong> {anime.anime_type === "TV" ? "Сериал" : "Фильм"}</p>
                </div>

                <div style={styles.ratingBox}>
                    <h3>Средний рейтинг {anime.avg_rating}</h3>
                    <div style={styles.ratingBar}>
                        <div style={{ ...styles.ratingFill, width: `${anime.avg_rating * 10}%` }}></div>
                    </div>
                </div>

                <div style={styles.reviewsBox}>
                    <h3>Оценки ({anime.reviews_count})</h3>
                    <AnimeHistogram ratings={anime.rating_histogram} />
                </div>
            </div>

            <div style={styles.descriptionBox}>
                <h3>Описание</h3>
                <p>{anime.description}</p>
            </div>
                
            <ReviewForm animeId={id} onReviewSubmitted={() => {
                api.get(`/anime/${id}/reviews/`)
                    .then((response) => setReviews(response.data))
                    .catch((error) => console.error("Ошибка загрузки отзывов:", error));
            }} />

            <ReviewList reviews={reviews} />
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        color: "#fff",
        backgroundColor: "#222",
    },
    header: {
        backgroundColor: "#333",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    backButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
    },
    userBox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    username: {
        color: "#f39c12",
        textDecoration: "none",
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
    },
    loginButton: {
        backgroundColor: "gray",
        color: "white",
        padding: "5px 10px",
        textDecoration: "none",
    },
    registerButton: {
        backgroundColor: "#f39c12",
        color: "white",
        padding: "5px 10px",
        textDecoration: "none",
    },
    mainContent: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "20px",
        paddingTop: "20px",
    },
    leftColumn: {
        gridColumn: "1 / 2",
    },
    poster: {
        width: "100%",
        height: "auto",
        borderRadius: "10px",
    },
    infoBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        gridColumn: "2 / 3",
    },
    ratingBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        gridColumn: "3 / 4",
    },
    ratingBar: {
        width: "100%",
        height: "20px",
        backgroundColor: "#444",
        borderRadius: "10px",
        overflow: "hidden",
    },
    ratingFill: {
        height: "100%",
        backgroundColor: "#f39c12",
    },
    reviewsBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        gridColumn: "4 / 5",
    },
    descriptionBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
    },
    authButtons: {
        display: "flex",
        gap: "10px",
    },
};

export default AnimeDetail;
