import { PageProps } from '@/types';
import { AppLayout } from '@/Components/Layout';
import { Card, Button } from '@/Components/UI';

export default function Welcome({ auth }: PageProps) {
    return (
        <AppLayout title="Welcome to Adventurers' Hall">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-display font-bold text-white mb-4">
                            Welcome to Adventurers' Hall
                        </h1>
                        <p className="text-xl text-primary-300 mb-8">
                            Your Premier Board Game & Tabletop Cafe
                        </p>
                        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                            Discover a world of adventure through tabletop gaming. Whether you're a seasoned adventurer 
                            or just starting your journey, we have the perfect space and experience for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg">
                                Book a Room
                            </Button>
                            <Button variant="ghost" size="lg">
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Private Rooms</h3>
                                <p className="text-gray-300">
                                    Book our Rose Garden or Obsidian Sanctuary for your gaming sessions
                                </p>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Learn & Play</h3>
                                <p className="text-gray-300">
                                    Join guided sessions to learn new tabletop RPG systems
                                </p>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Community Events</h3>
                                <p className="text-gray-300">
                                    Join tournaments, workshops, and special gaming events
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Status Message */}
                    <Card className="text-center">
                        <div className="text-gray-300">
                            <p className="text-lg font-semibold text-primary-400 mb-2">
                                InertiaJS + React Foundation Complete! 🎉
                            </p>
                            <p>Laravel + React + InertiaJS + TypeScript + Tailwind CSS</p>
                            {auth.user && (
                                <p className="mt-4 text-primary-400">
                                    Welcome back, {auth.user.name}!
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}