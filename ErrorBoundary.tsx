import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error trapped by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-[#f5f0e6] flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-[#111111] border border-[#d4c59d]/40 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif-luxury text-xl font-bold text-[#f5f0e6]">
                TURATH • Egyptian Brass Heritage
              </h2>
              <p className="text-xs text-[#9e9174]">
                A display error occurred. You can safely restore the application view.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all flex items-center justify-center gap-2 shadow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
