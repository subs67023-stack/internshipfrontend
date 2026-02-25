import { LayoutDashboard, PlusCircle, LogOut, Users, Settings, ClipboardList, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle }) => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Boards', icon: ClipboardList, path: '/boards' },
        { name: 'Members', icon: Users, path: '/members' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        if (onToggle) onToggle(false);
    };

    return (
        <aside
            className={`fixed md:sticky top-0 left-0 z-50 w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    SyncBoard
                </h1>
                <button
                    onClick={() => onToggle(false)}
                    className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleNavigate(item.path)}
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider font-semibold">Pro User</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
