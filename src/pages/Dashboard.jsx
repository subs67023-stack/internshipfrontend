import React, { useEffect, useState } from 'react';
import { Plus, Layout as LayoutIcon, Calendar, Users as UsersIcon, ChevronRight, Loader2 } from 'lucide-react';
import useBoardStore from '../store/boardStore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { boards, loading, fetchBoards, createBoard } = useBoardStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        setCreating(true);
        try {
            const board = await createBoard({ title: newBoardTitle });
            setShowCreateModal(false);
            setNewBoardTitle('');
            navigate(`/boards/${board.id}`);
        } catch (error) {
            console.error('Failed to create board:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Your Boards</h1>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">Manage and collaborate on your projects</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Board</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            ) : boards.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutIcon className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No boards yet</h3>
                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                        Create your first board to start collaborating with your team on notes and tasks.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-2 mx-auto"
                    >
                        <Plus size={20} />
                        <span>Create your first board</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            onClick={() => navigate(`/boards/${board.id}`)}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group hover:bg-slate-800/50"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                    <LayoutIcon className="text-blue-400" size={24} />
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {board.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                Owner: {board.owner?.name}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500 font-medium">
                                <div className="flex items-center space-x-1">
                                    <Calendar size={14} />
                                    <span>{new Date(board.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1 group-hover:text-blue-400 transition-colors">
                                    <span>View Board</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Board Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-2">Create New Board</h3>
                        <p className="text-slate-400 mb-6">Choose a clear title for your workspace</p>

                        <form onSubmit={handleCreateBoard} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Board Title</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    value={newBoardTitle}
                                    onChange={(e) => setNewBoardTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="e.g., Marketing Campaign"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !newBoardTitle.trim()}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {creating ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Board'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
