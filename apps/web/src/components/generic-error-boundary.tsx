import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class GenericErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    error && console.log('GenericErrorBoundary error', error);
    // Error is caught and not logged in console
    this.setState({ hasError: true });
    // Optionally log error information to an error reporting service
  }

  render() {
    // if (this.state.hasError) {
    //   // You can render any custom fallback UI
    //   return <h1>Something went wrong.</h1>;
    // }
    return this.props.children;
  }
}
