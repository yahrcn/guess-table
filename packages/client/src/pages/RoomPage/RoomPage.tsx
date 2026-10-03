import { useParams } from 'react-router-dom';
import { Room } from '../../components/Room';

export const RoomPage = () => {
  const { roomId = '' } = useParams<{ roomId: string }>();
  return <Room roomId={roomId} />;
};
