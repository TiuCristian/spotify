import React, { useState, useRef } from "react";
import "../Styles/MusicPlayer.css";
import {
    FaRegHeart,
    FaHeart,
    FaStepBackward,
    FaBackward,
    FaPlayCircle,
    FaPauseCircle,
    FaForward,
    FaStepForward,
    FaShareAlt,
} from "react-icons/fa";
import { BsDownload } from "react-icons/bs";

function MusicPLayer({ song }) {
    const [isLove, setLoved] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioPlayer = useRef();
    const progressBar = useRef();
    const animationRef = useRef();

    const changePlayPause = () => {
        setPlaying(!isPlaying);
        if (!isPlaying) {
            animationRef.current = requestAnimationFrame(whilePlaying);
            audioPlayer.current.play();
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    };

    const calculateTime = (sec) => {
        sec = isNaN(sec) ? 0 : sec;
        const minutes = Math.floor(sec / 60);
        const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(sec % 60);
        const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${returnMin}:${returnSec}`;
    };

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changeCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const changeProgress = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changeCurrentTime();
    };

    const changeCurrentTime = () => {
        setCurrentTime(progressBar.current.value);
    };

    const changeLoved = () => {
        setLoved(!isLove);
    };

    return (
        <div className="musicPlayer">
            <div className="songImage">
                <img src={song.imgSrc} alt="" />
            </div>
            <div className="songAttributes">
                <audio
                    src={song.song}
                    preload="metadata"
                    ref={audioPlayer}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                />
                <div className="top">
                    <div className="left">
                        <div className="loved" onClick={changeLoved}>
                            {isLove ? (
                                <i>
                                    <FaHeart />
                                </i>
                            ) : (
                                <i>
                                    <FaRegHeart />
                                </i>
                            )}
                        </div>
                        <div className="download">
                            <i>
                                <BsDownload />
                            </i>
                        </div>
                    </div>
                    <div className="middle">
                        <div className="back">
                            <i>
                                <FaStepBackward />
                            </i>
                            <i>
                                <FaBackward />
                            </i>
                        </div>
                        <div className="playPause" onClick={changePlayPause}>
                            {isPlaying ? (
                                <i>
                                    <FaPauseCircle />
                                </i>
                            ) : (
                                <i>
                                    <FaPlayCircle />
                                </i>
                            )}
                        </div>
                        <div className="forward">
                            <i>
                                <FaForward />
                            </i>
                            <i>
                                <FaStepForward />
                            </i>
                        </div>
                    </div>
                    <div className="right">
                        <i>
                            <FaShareAlt />
                        </i>
                    </div>
                </div>
                <div className="bottom">
                    <div className="currentTime">
                        {calculateTime(currentTime)}
                    </div>
                    <input
                        type="range"
                        className="progressBar"
                        ref={progressBar}
                        onChange={changeProgress}
                        max={duration}
                        min={0}
                        style={{
                            "--player-played":
                                (progressBar?.current?.value / duration) * 100 +
                                "%",
                        }}
                    />
                    <div className="duration">
                        {/* {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"} */}

                        {calculateTime(duration)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { MusicPLayer };
