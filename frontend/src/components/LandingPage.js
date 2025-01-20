// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Layout, Palette, Cloud } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Mail className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">EmailCraft</span>
                        </div>
                        <button
                            onClick={() => navigate('/builder')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                        Create Beautiful Email Templates
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Design professional email templates with our intuitive drag-and-drop builder. 
                        No coding required.
                    </p>
                    <button
                        onClick={() => navigate('/builder')}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                    >
                        Start Building Now
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 text-center">
                            <Layout className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Drag & Drop Editor</h3>
                            <p className="text-gray-600">
                                Easily design emails with our intuitive drag and drop interface.
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Custom Styling</h3>
                            <p className="text-gray-600">
                                Customize colors, fonts, and layouts to match your brand.
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Save & Reuse</h3>
                            <p className="text-gray-600">
                                Save your templates and reuse them anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;