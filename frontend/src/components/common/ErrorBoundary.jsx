import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("React Error Boundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col items-center justify-center p-6">
                    <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-8 max-w-md w-full shadow-lg text-center">
                        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-text-main dark:text-text-mainDark mb-2">Something went wrong</h2>
                        <p className="text-text-muted dark:text-text-mutedDark mb-6">
                            We've encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            <RefreshCw size={18} />
                            Refresh Page
                        </button>
                        {import.meta.env.DEV && (
                            <div className="mt-6 text-left bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs text-red-600 dark:text-red-400 overflow-x-auto">
                                <pre>{this.state.error?.toString()}</pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
