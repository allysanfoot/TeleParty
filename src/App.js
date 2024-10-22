import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CreateRoomPage from './pages/CreateRoomePage';
import RoomPage from './pages/RoomPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for creating a new room */}
        <Route path="/room/new" element={<CreateRoomPage />} />
        {/* Route for joining an existing room by roomId */}
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
