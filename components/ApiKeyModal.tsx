
import React, { useState } from 'react';
import { useGemini } from '../contexts/GeminiContext';
import { Key, Save, AlertCircle } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
    const { isConfigured, setApiKey } = useGemini();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    if (isConfigured) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim().length < 10) {
            setError('Invalid API Key format');
            return;
        }
        setApiKey(inputValue.trim());
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Key size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">API Key Required</h2>
                        <p className="text-sm text-gray-400">Gemini API configuration</p>
                    </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                    The application requires a Google Gemini API key to function.
                    Please enter your key below. It will be stored locally in your browser.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your Gemini API Key"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                        />
                        {error && (
                            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                                <AlertCircle size={12} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!inputValue}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save size={18} />
                        Save Configuration
                    </button>
                </form>

                <p className="mt-4 text-xs text-center text-gray-600">
                    This key is never sent to our servers. It is used directly against Google's API.
                </p>
            </div>
        </div>
    );
};
