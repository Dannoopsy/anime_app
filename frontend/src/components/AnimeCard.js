import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from '../config.js';

const AnimeCard = ({ anime }) => {
    return (
        <Link to={`/anime/${anime.id}`} style={styles.link}>
            <div style={styles.card}>
                <div style={styles.imageContainer}>
                    <img src={`${BASE_URL}${anime.posters}`} alt={anime.title} style={styles.image} />
                </div>
                <p style={styles.title}>{anime.title}</p>
            </div>
        </Link>
    );
};

// 🔹 Стили
const styles = {
    link: {
        textDecoration: "none",
        color: "inherit",
    },
    card: {
        width: "200px",
        textAlign: "center",
    },
    imageContainer: {
        width: "200px",
        height: "300px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover", 
    },
    title: {
        marginTop: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
    },
};

export default AnimeCard;
