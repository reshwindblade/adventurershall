import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Navigation() {
    const { auth } = usePage<PageProps>().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <nav className="bg-black border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <h1 className="text-2xl font-display font-bold text-white">
                                    Adventurers' Hall
                                </h1>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <Link
                                href="/"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/book-room"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Book a Room
                            </Link>
                            <Link
                                href="/book-session"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Book a Session
                            </Link>
                            <Link
                                href="/news"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                News
                            </Link>
                            <Link
                                href="/events"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Events
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-white hover:border-primary-500 focus:outline-none focus:text-white focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {auth.user ? (
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300">
                                        Welcome, {auth.user.name}
                                    </span>
                                    {auth.user.is_admin && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-300 hover:text-white text-sm font-medium"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:bg-gray-800 focus:text-gray-300 transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path
                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            <div className={showingNavigationDropdown ? 'block' : 'hidden' + ' sm:hidden'}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/book-room"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        Book a Room
                    </Link>
                    <Link
                        href="/book-session"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        Book a Session
                    </Link>
                    <Link
                        href="/news"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        News
                    </Link>
                    <Link
                        href="/events"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        Events
                    </Link>
                    <Link
                        href="/contact"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Responsive Settings Options */}
                <div className="pt-4 pb-1 border-t border-gray-800">
                    {auth.user ? (
                        <div>
                            <div className="px-4">
                                <div className="font-medium text-base text-white">{auth.user.name}</div>
                                <div className="font-medium text-sm text-gray-400">{auth.user.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                {auth.user.is_admin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary-400 hover:text-primary-300 hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-primary-300 focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Link
                                href="/login"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border-primary-500 focus:outline-none focus:text-white focus:bg-gray-800 focus:border-primary-500 transition duration-150 ease-in-out"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}