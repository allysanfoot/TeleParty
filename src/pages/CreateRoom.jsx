import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import io from 'socket.io-client';

const CreateRoom = () => {
    const socketRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        // Establish socket connection once when the component mounts
        socketRef.current = io('http://localhost:5000'); // Adjust to your backend URL

        // Clean up the socket connection when the component unmounts
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Function to handle room creation
    const createRoom = () => {
        const newRoomId = nanoid(10);  // Generate a random room ID
        socketRef.current.emit('createRoom', newRoomId);  // Send room ID to the server
        navigate(`/room/${newRoomId}`);  // Redirect to the new room URL
    };

    return (
        <div>
            <button onClick={createRoom}>
                Create New Room
            </button>
        </div>
    );
};

export default CreateRoom;
