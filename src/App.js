import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import RoomPage from './pages/Room';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />
        {/* Route for joining an existing room by roomId */}
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
