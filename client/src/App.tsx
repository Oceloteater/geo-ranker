import React from 'react';
import { ErrorBoundary, Main } from './components';

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