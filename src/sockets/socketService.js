import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://internshipbackend-r8m1.onrender.com';

class SocketService {
    socket = null;

    connect(userId, boardId) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
            this.socket.emit('join_board', { user_id: userId, board_id: boardId });
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }
}

const socketService = new SocketService();
export default socketService;
