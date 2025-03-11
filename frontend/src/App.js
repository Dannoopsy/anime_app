import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AnimeList from "./pages/AnimeList";
import AnimeDetail from "./pages/AnimeDetail";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import RegisterPage from "./pages/RegisterPage";
import api from "./api/api";

const App = () => {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const response = await api.get("/anime/");
                setAnimeList(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке списка аниме", error);
            }
        };
        fetchAnime();
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<AnimeList animeList={animeList} />} />
                    <Route path="/anime/:id" element={<AnimeDetail />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/users/:username" element={<UserProfile />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
