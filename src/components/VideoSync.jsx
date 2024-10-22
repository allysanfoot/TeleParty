import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';

const VideoSync = ({ roomId }) => {
    const playerRef = useRef(null);
    const socketRef = useRef();
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io('http://localhost:5000'); // Replace with your server URL if necessary

        return () => {
            socketRef.current.disconnect(); // Clean up on unmount
        };
    }, []);

    useEffect(() => {
        if (roomId) {
            console.log(`Joining room: ${roomId}`);
            socketRef.current.emit('joinRoom', roomId);

            // Listen for video actions from other users
            const handleVideoAction = ({ action, currentTime, sender }) => {
                // Avoid acting on the event triggered by the same user
                if (sender !== socketRef.current.id) {
                    if (action === 'play') {
                        playerRef.current.seekTo(currentTime);
                        setPlaying(true);
                    } else if (action === 'pause') {
                        playerRef.current.seekTo(currentTime);
                        setPlaying(false);
                    }
                }
            };

            // Attach event listener
            socketRef.current.on('videoAction', handleVideoAction);

            // Clean up the listener on unmount or room change
            return () => {
                socketRef.current.off('videoAction', handleVideoAction);
            };
        }
    }, [roomId]);

    const handlePlayPause = () => {
        const action = playing ? 'pause' : 'play';
        const currentTime = playerRef.current.getCurrentTime();

        // Emit the action, current time, and sender information to the server
        socketRef.current.emit('syncVideo', { roomId, action, currentTime, sender: socketRef.current.id });
        setPlaying(!playing); // Toggle play/pause state
    };

    return (
        <div>
            <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=xAWDqdpOlu8"
                playing={playing}
            />
            <button onClick={handlePlayPause}>
                {playing ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default VideoSync;
