import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
import { RoomPage } from '../../pages/RoomPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
};
