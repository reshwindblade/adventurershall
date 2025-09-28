import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { NewsArticle } from '@/types';

interface Props {
    article: NewsArticle;
}

export default function NewsShow({ article }: Props) {
    return (
        <AppLayout>
            <Head title={`${article.title} - News - Adventurers' Hall`} />
            
            <div className="min-h-screen bg-white">
                {/* Article Header */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="mb-8">
                            <Link
                                href={route('news.index')}
                                className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to News
                            </Link>
                        </nav>
                        
                        <div className="text-center">
                            <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
                                <time dateTime={article.published_at || ''}>
                                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Date not available'}
                                </time>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {article.title}
                            </h1>
                            {article.excerpt && (
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {article.excerpt}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                {article.featured_image && (
                    <section className="py-8">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                <img
                                    src={article.featured_image}
                                    alt={article.title}
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Article Content */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                </section>

                {/* Article Footer */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Stay Updated
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Don't miss out on the latest news and updates from Adventurers' Hall
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('news.index')}
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    More News
                                </Link>
                                <Link
                                    href={route('events.index')}
                                    className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    View Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}