import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Main />
      </div>
    </ErrorBoundary>
  );
}

export default App;