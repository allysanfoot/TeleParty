import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const CreateRoomPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const newRoomId = nanoid(10);  // Generate a random room ID
        navigate(`/room/${newRoomId}`);  // Redirect to the new room URL
    }, [navigate]);

    return <div>Creating room...</div>;  // Optionally show a loading screen
};

export default CreateRoomPage;
