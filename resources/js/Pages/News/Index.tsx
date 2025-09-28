import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { NewsArticle, PaginatedData } from '@/types';

interface Props {
    articles: PaginatedData<NewsArticle>;
}

export default function NewsIndex({ articles }: Props) {
    return (
        <AppLayout>
            <Head title="News - Adventurers' Hall" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Latest <span className="text-pink-500">News</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Stay updated with the latest happenings at Adventurers' Hall
                        </p>
                    </div>
                </section>

                {/* News Articles */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {articles.data.length > 0 ? (
                            <>
                                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {articles.data.map((article) => (
                                        <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                            {article.featured_image && (
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <img
                                                        src={article.featured_image}
                                                        alt={article.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                                    <time dateTime={article.published_at || ''}>
                                                        {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'Date not available'}
                                                    </time>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                                    <Link
                                                        href={route('news.show', article.slug)}
                                                        className="hover:text-pink-500 transition-colors"
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </h2>
                                                {article.excerpt && (
                                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                <Link
                                                    href={route('news.show', article.slug)}
                                                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                                                >
                                                    Read More
                                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {articles.links && articles.links.length > 3 && (
                                    <div className="mt-12 flex justify-center">
                                        <nav className="flex items-center space-x-2">
                                            {articles.links.map((link, index) => (
                                                <div key={index}>
                                                    {link.url ? (
                                                        <Link
                                                            href={link.url}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                                link.active
                                                                    ? 'bg-pink-500 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Articles Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    We're working on bringing you the latest updates. Check back soon!
                                </p>
                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}