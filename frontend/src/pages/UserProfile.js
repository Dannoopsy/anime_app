import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import AnimeHistogram from "../components/AnimeHistogram";
import api from "../api/api";
const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
    
        api.get(`/users/${username}/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((res) => {
                if (res.status === 401) {
                    throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
                }
                return res.data;
            })
            .then(setProfile)
            .catch((err) => {
                console.error("Ошибка загрузки профиля:", err);
                setError(err.message);
            });
    }, [username]);


    const handleEditClick = () => {
        setIsEditing(true);
        setBio(profile?.profile?.bio || "");
    };

    const handleSave = async () => {
        if (!bio.trim() && !avatar) {
            alert("Нет изменений для сохранения.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("bio", bio);
            if (avatar) formData.append("avatar", avatar);
    
            const response = await api.patch(`/users/${username}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
    
            setProfile(response.data);
            setIsEditing(false);
        } catch (error) {
            alert(error.response?.data?.error || "Ошибка при обновлении профиля");
        }
    };


    if (error) {
        return (
            <div style={styles.container}>
                <p style={styles.error}>{error}</p>
                <button onClick={() => navigate("/login")} style={styles.loginButton}>
                    Войти
                </button>
            </div>
        );
    }

    if (!profile) return <div>Загрузка...</div>;

    return (
        <>
            <div style={styles.container}>
                <div style={styles.header}>
                    <button onClick={() => navigate(-1)} style={styles.backButton}>
                        ← Назад
                    </button> 
                    <h1 style={{ flexGrow: 1 }}>{profile.username}</h1>
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
                        <img src={`http://127.0.0.1:8000${profile.profile?.avatar}`} alt="Аватар" style={styles.avatar} />
                        {user?.username === username && (
                            <button onClick={handleEditClick} style={styles.editButton}>Редактировать</button>
                        )}
                    </div>
                    <div style={styles.bioBox}>
                        <h3>Биография</h3>
                        {isEditing ? (
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                style={styles.textarea}
                            />
                        ) : (
                            <p>{profile.profile?.bio || "Нет информации"}</p>
                        )}
                    </div>
                    <div style={styles.statsBox}>
                        <h3>Статистика оценок</h3>
                        <AnimeHistogram ratings={profile.rating_histogram} />
                    </div>
                    <div style={styles.animeList}>
                        <h3>Оцененные аниме ({profile.review_count})</h3>
                        <div style={styles.animeContainer}>
                            {profile.rated_anime.map(anime => (
                                <div key={anime.id} style={styles.animeItem}>
                                    <img 
                                        src={`http://127.0.0.1:8000${anime.posters}`} 
                                        alt={anime.title} 
                                        style={styles.animePoster} 
                                        onClick={() => navigate(`/anime/${anime.id}`)}
                                    />
                                    <span title={anime.title} style={styles.animeTitle} onClick={() => navigate(`/anime/${anime.id}`)}>{anime.title} </span>
                                    <div style={styles.rating}>{anime.user_score}/10</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <div style={styles.editForm}>
                        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
                        <button onClick={handleSave} style={styles.saveButton}>Сохранить</button>
                    </div>
                )}
            </div>
            <div style={styles.footer}>
                
            </div>
        </>
    );
};

const styles = {
    container: { padding: "20px", color: "#fff", backgroundColor: "#222" },
    backButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
    },
    
    header: {
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    mainContent: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", paddingTop: "20px" },
    leftColumn: { gridColumn: "1 / 2" },
    avatar: { width: "100%", borderRadius: "10px" },
    editButton: { marginTop: "10px", padding: "5px", backgroundColor: "#f39c12", border: "none", cursor: "pointer" },
    bioBox: { gridColumn: "2 / 3", backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "15px", borderRadius: "10px" },
    statsBox: { gridColumn: "3 / 4", backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "15px", borderRadius: "10px" },
    animeList: { gridColumn: "4 / 5", backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "15px", borderRadius: "10px" },
    animeContainer: { maxHeight: "400px", overflowY: "auto" },
    animeItem: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" },
    animePoster: { width: "50px", 
        height: "50px", 
        borderRadius: "10%",
        cursor: "pointer",
        objectFit: "cover", },
    animeTitle: { flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    rating: { color: "gold" },
    editForm: { marginTop: "20px", display: "flex", gap: "10px" },
    saveButton: { padding: "5px", backgroundColor: "#f39c12", border: "none", cursor: "pointer" },
    textarea: {
        width: "90%",
        height: "80px",
        padding: "10px",
        borderRadius: "5px",
        resize: "none",  
        overflow: "hidden",  
        border: "1px solid #ccc",
        fontSize: "14px"
    },
    authButtons: {
        display: "flex",
        gap: "10px",
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
    username: {
        color: "#f39c12",
        textDecoration: "none",
        fontWeight: "bold",
        padding: "5px 10px",
    },
    footer: {
        padding: "20px",
        color: "#fff",
        backgroundColor: "#222",
        height: "27vh",
        
        
    },
};

export default UserProfile;
