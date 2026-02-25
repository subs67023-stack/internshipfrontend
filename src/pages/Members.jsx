import React, { useEffect, useState } from 'react';
import { Users, Mail, Shield, UserMinus, PlusCircle } from 'lucide-react';
import useBoardStore from '../store/boardStore';
import api from '../utils/api';

const MembersPage = () => {
    const { boards, fetchBoards } = useBoardStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoards().finally(() => setLoading(false));
    }, [fetchBoards]);

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-6xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
                <p className="text-slate-400">Manage your project members and their roles across your boards.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {boards.map((board) => (
                    <div key={board.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <Shield className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{board.title}</h2>
                                    <p className="text-slate-400 text-sm">Members in this board</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {board.members?.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {member.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{member.user?.name}</p>
                                            <p className="text-slate-400 text-xs flex items-center space-x-1">
                                                <Shield size={12} className="text-blue-400" />
                                                <span className="capitalize">{member.role}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {boards.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <Users size={48} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No boards found</h3>
                    <p className="text-slate-400">Create a board to start collaborating with others.</p>
                </div>
            )}
        </div>
    );
};

export default MembersPage;
