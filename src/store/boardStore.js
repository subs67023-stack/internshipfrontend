import { create } from 'zustand';
import api from '../utils/api';

const useBoardStore = create((set, get) => ({
    boards: [],
    currentBoard: null,
    loading: false,

    fetchBoards: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/boards');
            set({ boards: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    setCurrentBoard: (board) => set({ currentBoard: board }),

    fetchBoardById: async (id) => {
        set({ loading: true });
        try {
            const res = await api.get(`/boards/${id}`);
            set({ currentBoard: res.data, loading: false });
            return res.data;
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    createBoard: async (boardData) => {
        try {
            const res = await api.post('/boards', boardData);
            set((state) => ({ boards: [...state.boards, res.data] }));
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateNote: (noteData) => {
        set((state) => {
            if (!state.currentBoard) return state;
            const notes = state.currentBoard.notes.map(n =>
                n.id === noteData.id ? { ...n, ...noteData } : n
            );
            return { currentBoard: { ...state.currentBoard, notes } };
        });
    },

    updateTask: (taskData) => {
        set((state) => {
            if (!state.currentBoard) return state;
            const tasks = state.currentBoard.tasks.map(t =>
                t.id === taskData.id ? { ...t, ...taskData } : t
            );
            return { currentBoard: { ...state.currentBoard, tasks } };
        });
    }
}));

export default useBoardStore;
