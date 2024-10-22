import React from 'react';
import { useParams } from 'react-router-dom';
import VideoSync from '../components/VideoSync';

const RoomPage = () => {
    const { roomId } = useParams();  // Extract the roomId from the URL

    console.log(`Joined Room ID: ${roomId}`);

    return (
        <div>
            <h1>Room Page: {roomId}</h1>
            {/* Pass the roomId to VideoSync */}
            <VideoSync roomId={roomId} />
        </div>
    );
};

export default RoomPage;
