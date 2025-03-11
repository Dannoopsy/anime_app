import React from "react";

const AnimeHistogram = ({ ratings }) => {
    if (!ratings) return null;

    const sortedRatings = Object.entries(ratings)
        .sort(([a], [b]) => b - a);

    const maxCount = Math.max(...Object.values(ratings));

    return (
        <div style={styles.histogramContainer}>
            {sortedRatings.map(([rating, count]) => (
                <div key={rating} style={styles.histogramRow}>
                    <span>{rating}</span>
                    <div style={{ ...styles.bar, width: `${(count / maxCount) * 100}%` }}>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    histogramContainer: {
        backgroundColor: "#222",
        padding: "10px",
        borderRadius: "5px"
    },
    histogramRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: "5px"
    },
    bar: {
        height: "10px",
        backgroundColor: "#f39c12",
        marginLeft: "10px",
        borderRadius: "3px",
        position: "relative"
    },
    count: {
        position: "absolute",
        right: "-25px",
        color: "white",
        fontSize: "12px"
    }
};

export default AnimeHistogram;

