import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) {
        return (
            <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
