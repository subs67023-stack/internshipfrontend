import { useState } from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) {
        return (
            <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-900 z-30">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        SyncBoard
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
