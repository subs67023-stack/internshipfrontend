import React from 'react';
import { LayoutDashboard, PlusCircle, LogOut, Users, Settings, ClipboardList } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Boards', icon: ClipboardList, path: '/boards' },
        { name: 'Members', icon: Users, path: '/members' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen stick top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    SyncBoard
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                                ? 'bg-blue-600/10 text-blue-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-4 py-3 mb-4 bg-slate-800/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
