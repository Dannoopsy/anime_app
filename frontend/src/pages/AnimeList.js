import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import AuthContext from "../context/AuthContext";
import api from "../api/api";

const AnimeList = () => {
    const [animes, setAnimes] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        api.get("/anime/")
            .then((response) => setAnimes(response.data))
            .catch((error) => console.error("Ошибка при загрузке аниме", error));
    }, []);
    
    return (
        <div>
            {/* 🔹 Тёмная полоска сверху */}
            <div style={styles.header}>
                <h2>Список аниме</h2>
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

            {/* 🔹 Контейнер с аниме */}
            <div style={styles.container}>
                {animes.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    header: {
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userBox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    authButtons: {
        display: "flex",
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
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
    },
};

export default AnimeList;
