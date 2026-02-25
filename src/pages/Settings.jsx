import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Palette, Globe } from 'lucide-react';
import useAuthStore from '../store/authStore';

const SettingsPage = () => {
    const { user } = useAuthStore();

    const sections = [
        { name: 'Profile', icon: User, desc: 'Update your personal information and bio' },
        { name: 'Account Security', icon: Lock, desc: 'Manage your password and security settings' },
        { name: 'Notifications', icon: Bell, desc: 'Configure how you receive updates' },
        { name: 'Appearance', icon: Palette, desc: 'Customize your theme and layout' },
        { name: 'Language', icon: Globe, desc: 'Choose your preferred language' },
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto h-screen overflow-y-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Workspace Settings</h1>
                <p className="text-slate-400">Manage your account preferences and application settings.</p>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm mb-8">
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-800">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <p className="text-slate-400">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                            Pro Account
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.name} className="group flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl transition-all cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-600/10 transition-colors">
                                    <section.icon className="text-slate-400 group-hover:text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{section.name}</h3>
                                    <p className="text-slate-500 text-sm">{section.desc}</p>
                                </div>
                            </div>
                            <div className="text-slate-600 group-hover:text-white transition-colors">
                                <SettingsIcon size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="text-red-400 font-bold">Danger Zone</h3>
                    <p className="text-red-400/60 text-sm">Delete your account and all associated data</p>
                </div>
                <button className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all">
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
