import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';



const DailyQuoteWidget = () => {
    const [quote, setQuote] = useState({ content: '', author: '' });
    const [loading, setLoading] = useState(true);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            // adviceslip returns { slip: { advice: "..." } }
            setQuote({ content: data.slip.advice, author: "Daily Advice" });
        } catch (error) {
            // Fallback to static requirement if API fails
            setQuote({ content: "Stay focused and keep building.", author: "TeamSync Pro" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-4 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            {/* Subtle background decoration */}
            <div className="absolute -top-8 -right-6 text-slate-50 dark:text-[#30363D]/20 transform rotate-12 transition-transform duration-700 group-hover:rotate-6">
                <Quote size={100} />
            </div>
            
            <div className="relative z-10 flex items-start gap-3">
                <div className="mt-0.5 text-primary">
                    <Quote size={16} className="fill-current opacity-20" />
                </div>
                <div className="flex-1 pr-6">
                    {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-3 bg-slate-100 dark:bg-[#30363D] rounded w-3/4" />
                            <div className="h-3 bg-slate-100 dark:bg-[#30363D] rounded w-1/2" />
                        </div>
                    ) : (
                        <>
                            <p className="text-text-main dark:text-text-mainDark font-medium italic leading-relaxed text-xs">
                                "{quote.content}"
                            </p>
                            <p className="text-[10px] text-text-muted dark:text-text-mutedDark font-semibold mt-1.5">
                                — {quote.author}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <button 
                onClick={fetchQuote} 
                disabled={loading}
                className="absolute top-2 right-2 p-1.5 text-text-muted dark:text-text-mutedDark hover:text-primary transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-[#21262D] disabled:opacity-50"
                title="Get new quote"
            >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
    );
};

export default DailyQuoteWidget;
