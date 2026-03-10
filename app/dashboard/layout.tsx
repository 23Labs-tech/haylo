'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    BarChart3,
    Settings,
    Phone,
    Users,
    Calendar,
    Bell,
    Search,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    ChevronDown
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User State
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>('U');

    // Dropdown States
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Try getSession first (faster, from cookies)
                const { data: { session } } = await supabase.auth.getSession();
                const email = session?.user?.email;

                if (email) {
                    setUserEmail(email);
                    const namePart = email.split('@')[0];
                    setInitials(namePart.substring(0, 2).toUpperCase());
                    return;
                }

                // Fallback: getUser (server round-trip)
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email) {
                    setUserEmail(user.email);
                    const namePart = user.email.split('@')[0];
                    setInitials(namePart.substring(0, 2).toUpperCase());
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();

        // Listen for auth state changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email) {
                setUserEmail(session.user.email);
                const namePart = session.user.email.split('@')[0];
                setInitials(namePart.substring(0, 2).toUpperCase());
            } else {
                setUserEmail(null);
                setInitials('U');
            }
        });

        return () => subscription.unsubscribe();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const navItems = [
        { icon: BarChart3, label: 'Overview', href: '/dashboard' },
        { icon: Phone, label: 'Call Logs', href: '/dashboard/calls' },
        { icon: Calendar, label: 'Bookings', href: '/dashboard/bookings' },
        { icon: Users, label: 'Customers', href: '/dashboard/customers' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-8 w-auto mix-blend-multiply" />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <button onClick={handleSignOut} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top header */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 z-10 w-full">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-end px-4 lg:ml-6 relative">
                        <div className="flex items-center gap-4 relative">

                            {/* Search */}
                            <div className="relative group hidden sm:block">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-black"
                                    placeholder="Search calls, guests..."
                                />
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        setShowUserMenu(false);
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-500 relative focus:outline-none"
                                >
                                    <Bell className="w-6 h-6" />
                                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                            <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                        </div>
                                        <div className="p-4 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                                                <Bell className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">You&apos;re all caught up!</p>
                                            <p className="text-xs text-gray-500 mt-1">Check back later for new alerts.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowUserMenu(!showUserMenu);
                                        setShowNotifications(false);
                                    }}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white hover:ring-purple-200 transition-all">
                                        {initials}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {userEmail || 'Loading...'}
                                            </p>
                                        </div>
                                        <div className="py-1">
                                            <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4 mr-3 text-red-400" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </header>

                {/* Main scrollable area */}
                <main
                    className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8 relative"
                    onClick={() => {
                        // Close dropdowns if user clicks main area
                        if (showUserMenu) setShowUserMenu(false);
                        if (showNotifications) setShowNotifications(false);
                    }}
                >
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
