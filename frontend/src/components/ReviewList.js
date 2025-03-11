import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewList = ({ reviews }) => {
    const [avatars, setAvatars] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatars = async () => {
            const avatarData = {};
            for (const review of reviews) {
                if (!avatars[review.user]) {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/users/${review.user}/`);
                        const userData = await response.json();
                        avatarData[review.user] = userData.profile?.avatar ? `http://127.0.0.1:8000${userData.profile.avatar}` : "/default-avatar.png";
                    } catch (error) {
                        console.error("Ошибка загрузки аватара:", error);
                        avatarData[review.user] = "/default-avatar.png";
                    }
                }
            }
            setAvatars(prev => ({ ...prev, ...avatarData }));
        };

        if (reviews.length > 0) {
            fetchAvatars();
        }
    }, [reviews]);

    return (
        <div style={styles.reviewsContainer}>
            {reviews.length === 0 ? (
                <p>Отзывов пока нет. Будьте первым!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.userInfo}>
                            <img 
                                src={avatars[review.user] || "/default-avatar.png"} 
                                alt="Аватар" 
                                style={styles.avatar} 
                                onClick={() => navigate(`/users/${review.user}`)}
                            />
                            <p 
                                style={styles.username} 
                                onClick={() => navigate(`/users/${review.user}`)}
                            >
                                {review.user}
                            </p>
                        </div>
                        <div style={styles.reviewText}>
                            <p>{review.text}</p>
                            <div style={styles.stars}>
                                {"★".repeat(review.rating) + "☆".repeat(10 - review.rating)}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    reviewsContainer: { marginTop: "20px" },
    reviewCard: {
        display: "flex",
        backgroundColor: "#222",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px"
    },
    userInfo: { 
        width: "100px", 
        textAlign: "center", 
        cursor: "pointer" 
    },
    avatar: { 
        width: "50px", 
        height: "50px", 
        borderRadius: "50%",
        cursor: "pointer",
        objectFit: "cover", 
    },
    username: {
        color: "#fff", 
        textDecoration: "underline", 
        cursor: "pointer" 
    },
    reviewText: { flex: 1, paddingLeft: "10px" },
    stars: { color: "gold", fontSize: "16px" }
};

export default ReviewList;
