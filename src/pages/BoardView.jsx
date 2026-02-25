import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, Save, Clock, Plus, Trash2, CheckCircle2, Circle,
    ArrowLeft, Send, UserPlus, Loader2, FileText, CheckSquare
} from 'lucide-react';
import useBoardStore from '../store/boardStore';
import useAuthStore from '../store/authStore';
import socketService from '../sockets/socketService';
import api from '../utils/api';

const BoardView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentBoard, fetchBoardById, updateNote, updateTask } = useBoardStore();
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState('notes'); // notes | tasks
    const [noteContent, setNoteContent] = useState('');
    const [presence, setPresence] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const noteTimeoutRef = useRef(null);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const board = await fetchBoardById(id);
                if (board.notes.length > 0) {
                    setNoteContent(board.notes[0].content || '');
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to load board:', error);
                navigate('/dashboard');
            }
        };

        loadBoard();

        // Socket setup
        if (user) {
            const socket = socketService.connect(user.id, id);

            socketService.on('note_update', (data) => {
                if (data.board_id === id) {
                    setNoteContent(data.content);
                    updateNote(data);
                }
            });

            socketService.on('presence_update', (data) => {
                setPresence(prev => ({ ...prev, [data.user_id]: data.status }));
            });
        }

        return () => {
            socketService.disconnect();
        };
    }, [id, user, fetchBoardById, navigate, updateNote]);

    const handleNoteChange = (e) => {
        const content = e.target.value;
        setNoteContent(content);

        // Debounced socket emit
        if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
        noteTimeoutRef.current = setTimeout(() => {
            socketService.emit('note_update', {
                board_id: id,
                note_id: currentBoard?.notes[0]?.id,
                content,
                updated_by: user.id
            });

            // Auto-save to DB
            api.put(`/notes/${currentBoard?.notes[0]?.id}`, { content });
        }, 500);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const title = e.target.taskTitle.value;
        if (!title) return;

        try {
            const res = await api.post('/tasks', { board_id: id, title });
            fetchBoardById(id); // Simple refresh
            e.target.reset();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const toggleTaskStatus = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await api.put(`/tasks/${task.id}`, { status: newStatus });
            fetchBoardById(id);
            socketService.emit('task_update', { board_id: id, task_id: task.id, status: newStatus });
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/boards/${id}/invite`, { email: inviteEmail, role: 'editor' });
            setShowInviteModal(false);
            setInviteEmail('');
            alert('Invite sent!');
        } catch (error) {
            alert(error.response?.data?.message || 'Invite failed');
        }
    };

    const createSnapshot = async () => {
        setSaving(true);
        try {
            await api.post(`/boards/${id}/snapshots`);
            alert('Snapshot saved successfully!');
        } catch (error) {
            console.error('Failed to create snapshot:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
    );

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 border border-slate-800">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{currentBoard?.title}</h1>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-medium px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                {currentBoard?.visibility}
                            </span>
                            <span className="text-slate-500 text-xs">•</span>
                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <Users size={14} />
                                <span>{currentBoard?.members.length} members</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                        title="Invite Members"
                    >
                        <UserPlus size={20} />
                    </button>
                    <button
                        onClick={createSnapshot}
                        disabled={saving}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Clock size={20} />}
                        <span>Snapshot</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'notes' ? 'bg-slate-800 text-blue-400 shadow-lg' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <FileText size={18} />
                    <span>Collaborative Notes</span>
                </button>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'tasks' ? 'bg-slate-800 text-blue-400 shadow-lg' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <CheckSquare size={18} />
                    <span>Task Manager</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                {activeTab === 'notes' ? (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <span className="text-sm text-slate-400 flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Live Collaboration Active</span>
                            </span>
                            <div className="flex -space-x-1.5 overflow-hidden">
                                {currentBoard?.members.map((member, i) => (
                                    <div
                                        key={member.id}
                                        title={member.user.name}
                                        className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold ring-2 ring-transparent group"
                                    >
                                        {member.user.name.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={noteContent}
                            onChange={handleNoteChange}
                            placeholder="Start typing your collaborative notes here..."
                            className="flex-1 w-full p-8 bg-transparent text-slate-200 resize-none focus:outline-none text-lg leading-relaxed placeholder:text-slate-700"
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col p-6 overflow-y-auto">
                        <form onSubmit={handleCreateTask} className="flex space-x-3 mb-8">
                            <input
                                name="taskTitle"
                                type="text"
                                placeholder="What needs to be done?"
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold flex items-center space-x-2 transition-all"
                            >
                                <Plus size={20} />
                                <span>Add Task</span>
                            </button>
                        </form>

                        <div className="space-y-3">
                            {currentBoard?.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => toggleTaskStatus(task)}
                                            className={`transition-colors ${task.status === 'done' ? 'text-green-500' : 'text-slate-500 group-hover:text-slate-400'}`}
                                        >
                                            {task.status === 'done' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                        </button>
                                        <span className={`font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <button className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {currentBoard?.tasks.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No tasks yet. Create one to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-2">Invite Member</h3>
                        <p className="text-slate-400 mb-6">Invite someone to collaborate on this board</p>

                        <form onSubmit={handleInvite} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                <input
                                    type="email"
                                    autoFocus
                                    required
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="colleague@example.com"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardView;
