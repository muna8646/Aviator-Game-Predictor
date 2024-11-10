import React from 'react';
import AITrainer from './components/AITrainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Aviator Game Predictor</h1>
        <AITrainer />
      </div>
    </div>
  );
}

export default App;