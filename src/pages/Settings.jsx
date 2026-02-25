import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Globe, Save, Loader2, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const SettingsPage = () => {
    const { user, setUser } = useAuthStore();
    const [activeSection, setActiveSection] = useState('overview'); // overview | profile | security

    // Profile Form State
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [profileLoading, setProfileLoading] = useState(false);

    // Password Form State
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/auth/update-profile', profileData);
            setUser(res.data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }
        setPasswordLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/auth/update-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (activeSection === 'profile') {
        return (
            <div className="max-w-2xl">
                <button onClick={() => setActiveSection('overview')} className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={18} />
                    <span>Back to Settings</span>
                </button>
                <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>
                <form onSubmit={handleProfileUpdate} className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input
                            type="text"
                            required
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            required
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <button
                        disabled={profileLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {profileLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>Save Changes</span>
                    </button>
                    {message.text && (
                        <p className={`text-center text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        );
    }

    if (activeSection === 'security') {
        return (
            <div className="max-w-2xl">
                <button onClick={() => setActiveSection('overview')} className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={18} />
                    <span>Back to Settings</span>
                </button>
                <h1 className="text-3xl font-bold text-white mb-8">Account Security</h1>
                <form onSubmit={handlePasswordUpdate} className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Current Password</label>
                        <input
                            type="password"
                            required
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">New Password</label>
                        <input
                            type="password"
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <button
                        disabled={passwordLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>Update Password</span>
                    </button>
                    {message.text && (
                        <p className={`text-center text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        );
    }

    const sections = [
        { id: 'profile', name: 'Profile', icon: User, desc: 'Update your personal information and bio' },
        { id: 'security', name: 'Account Security', icon: Lock, desc: 'Manage your password and security settings' },
        { id: 'notifications', name: 'Notifications', icon: Bell, desc: 'Configure how you receive updates' },
        { id: 'appearance', name: 'Appearance', icon: Palette, desc: 'Customize your theme and layout' },
        { id: 'language', name: 'Language', icon: Globe, desc: 'Choose your preferred language' },
    ];

    return (
        <div className="max-w-4xl">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Workspace Settings</h1>
                <p className="text-slate-400">Manage your account preferences and application settings.</p>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm mb-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 pb-8 border-b border-slate-800">
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
                        <div
                            key={section.id}
                            onClick={() => {
                                if (section.id === 'profile' || section.id === 'security') {
                                    setActiveSection(section.id);
                                    setMessage({ type: '', text: '' });
                                } else {
                                    alert(`${section.name} settings coming soon!`);
                                }
                            }}
                            className="group flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl transition-all cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-600/10 transition-colors">
                                    <section.icon className="text-slate-400 group-hover:text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{section.name}</h3>
                                    <p className="text-slate-500 text-sm hidden sm:block">{section.desc}</p>
                                </div>
                            </div>
                            <div className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                <Save size={20} className="md:hidden" />
                                <span className="hidden md:inline text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-400">Configure</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                    <h3 className="text-red-400 font-bold">Danger Zone</h3>
                    <p className="text-red-400/60 text-sm">Delete your account and all associated data</p>
                </div>
                <button
                    onClick={() => alert('Account deletion is disabled for demo purposes.')}
                    className="w-full md:w-auto px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all text-sm"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
