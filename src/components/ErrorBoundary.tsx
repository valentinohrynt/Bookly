import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonIcon, IonButton } from '@ionic/react';
import { bugOutline, refreshOutline } from 'ionicons/icons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Something went wrong</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                gap: '16px',
              }}
            >
              <IonIcon icon={bugOutline} size="large" color="danger" />
              <IonText color="danger">
                <h2>An unexpected error occurred</h2>
                <p style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                  {this.state.error?.message ?? 'Unknown error'}
                </p>
              </IonText>
              <IonButton onClick={this.handleReset}>
                <IonIcon slot="start" icon={refreshOutline} />
                Try Again
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;