import React, { ReactNode, Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };
  readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-800 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Oops!</h1>
          <p className="text-slate-600 mb-6 max-w-md">Something went wrong. Please reload the app.</p>
          <pre className="bg-slate-100 p-4 rounded text-xs text-left mb-6 overflow-auto max-w-full text-slate-500">
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-brand text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);