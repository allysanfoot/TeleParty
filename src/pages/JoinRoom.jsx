import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const JoinRoom = () => {
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const socketRef = useRef();  // To hold socket connection reference
    const navigate = useNavigate();

    useEffect(() => {
        // Establish socket connection once when the component mounts
        socketRef.current = io('http://localhost:5000');  // Adjust to your backend URL

        // Handle room errors from the server
        socketRef.current.on('roomError', (message) => {
            setError(message);  // Display error if room doesn't exist
        });

        // Clean up the socket connection and event listeners when the component unmounts
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            socketRef.current.emit('joinRoom', roomId);  // Emit joinRoom event
        }
    };

    useEffect(() => {
        // Listen for successful room join
        socketRef.current.on('joinedRoom', () => {
            navigate(`/room/${roomId}`);  // Redirect to the room if join is successful
        });

        // Cleanup event listener for room join when the component or roomId changes
        return () => {
            socketRef.current.off('joinedRoom');
        };
    }, [roomId, navigate]);  // Dependency on roomId and navigate

    return (
        <div>
            <h1>Join an Existing Room</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleJoinRoom}>
                <input 
                    type="text" 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)} 
                    placeholder="Enter Room ID" 
                    required 
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
};

export default JoinRoom;
