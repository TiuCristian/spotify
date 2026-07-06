// import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import { FaHeadphones, FaRegClock, FaRegHeart, FaHeart } from "react-icons/fa";
import { Songs } from "./Songs";
import { MusicPLayer } from "./MusicPLayer";

function AudioList() {
    const [songs, setSongs] = useState(Songs);
    const [currentSong, setCurrentSong] = useState(Songs[0]);

    //   useEffect(() => {
    //     const songs = document.querySelectorAll(".songs");

    //     function changeMenuActive() {
    //       songs.forEach((n) => n.classList.remove("active"));
    //       this.classList.add("active");
    //     }

    //     songs.forEach((n) => n.addEventListener("click", changeMenuActive));
    //   }, []);

    const changeFavorite = (id) => {
        Songs.forEach((song) => {
            if (song.id === id) {
                song.favorite = !song.favorite;
            }
        });

        setSongs([...Songs]);
    };

    //   const setMainSong = (song, imgSrc) => {
    //     setCurrentSong(songSrc);
    //     setImage(imgSrc);
    //   };

    return (
        <div className="audioList">
            <h2 className="title">
                The List
                <span>{Songs.length} songs</span>
                {/* <span>{'${Songs.length} songs'}</span> */}
            </h2>
            <div className="songsContainer">
                {songs &&
                    songs.map((song, index) => (
                        <div
                            className={
                                song.id === currentSong.id
                                    ? "active songs"
                                    : "songs"
                            }
                            key={song.id}
                            onClick={() => {
                                setCurrentSong(song);
                            }}
                        >
                            <div className="count">#{index + 1}</div>
                            <div className="song">
                                <div className="imgBox">
                                    <img src={song?.imgSrc} alt="" />
                                </div>
                                <div className="section">
                                    <p className="songName">
                                        {song?.songName}
                                        <span className="spanArtist">
                                            {song?.artist}
                                        </span>
                                    </p>
                                    <div className="hits">
                                        <p className="hit">
                                            <i>
                                                <FaHeadphones />
                                            </i>
                                            95,450,222
                                        </p>
                                        <p className="duration">
                                            <i>
                                                <FaRegClock />
                                            </i>
                                            03.04
                                        </p>
                                        <div
                                            className="favorite"
                                            onClick={() =>
                                                changeFavorite(song?.id)
                                            }
                                        >
                                            {song?.favorite ? (
                                                <i>
                                                    <FaHeart />
                                                </i>
                                            ) : (
                                                <i>
                                                    <FaRegHeart />
                                                </i>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <MusicPLayer song={currentSong} />
        </div>
    );
}

export { AudioList };
