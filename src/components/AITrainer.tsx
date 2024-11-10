import React, { useState, useEffect } from 'react';
import { AviatorAI } from '../models/AvatarAI';

const AITrainer: React.FC = () => {
  const [ai] = useState(new AviatorAI());
  const [isTraining, setIsTraining] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [crashPoint, setCrashPoint] = useState<string>('');
  const [history, setHistory] = useState<number[]>([]);
  const [patternSize] = useState(5);

  useEffect(() => {
    ai.initialize();
  }, []);

  const handleAddCrashPoint = () => {
    const value = parseFloat(crashPoint);
    if (!isNaN(value) && value >= 1) {
      setHistory(prev => [...prev, value]);
      setCrashPoint('');
    }
  };

  const handleTrain = async () => {
    if (history.length < patternSize) {
      alert(`Please add at least ${patternSize} crash points`);
      return;
    }

    setIsTraining(true);
    
    // Create training data from history
    const trainingData = [];
    const labels = [];
    
    for (let i = 0; i <= history.length - patternSize - 1; i++) {
      trainingData.push(history.slice(i, i + patternSize));
      labels.push(history[i + patternSize]);
    }

    await ai.train(trainingData, labels);
    setIsTraining(false);
  };

  const handlePredict = async () => {
    if (history.length < patternSize) {
      alert(`Please add at least ${patternSize} crash points`);
      return;
    }

    const lastPoints = history.slice(-patternSize);
    const result = await ai.predict(lastPoints);
    setPrediction(Math.max(1, result));
  };

  const getPatternAnalysis = () => {
    if (history.length < 2) return null;
    
    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    const trend = history[history.length - 1] > history[history.length - 2] ? 'Increasing' : 'Decreasing';
    
    return { avg, trend };
  };

  const analysis = getPatternAnalysis();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Aviator Pattern Predictor</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            step="0.01"
            min="1"
            value={crashPoint}
            onChange={(e) => setCrashPoint(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm p-2"
            placeholder="Enter crash point (e.g., 2.50)"
          />
          <button
            onClick={handleAddCrashPoint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Point
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Crash Points History:</h3>
        <div className="flex flex-wrap gap-2">
          {history.map((point, index) => (
            <div key={index} className="bg-gray-200 px-2 py-1 rounded">
              {point.toFixed(2)}x
            </div>
          ))}
        </div>
        {analysis && (
          <div className="mt-4 text-sm">
            <p>Average: {analysis.avg.toFixed(2)}x</p>
            <p>Trend: {analysis.trend}</p>
          </div>
        )}
      </div>

      <div className="space-x-4 mb-6">
        <button
          onClick={handleTrain}
          disabled={isTraining || history.length < patternSize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTraining ? 'Training...' : 'Analyze Pattern'}
        </button>
        
        <button
          onClick={handlePredict}
          disabled={history.length < patternSize}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Predict Next
        </button>
      </div>

      {prediction !== null && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">Next Crash Point Prediction:</h3>
          <p className="text-3xl font-bold text-green-600">{prediction.toFixed(2)}x</p>
          <p className="text-sm text-gray-600 mt-2">
            Based on the pattern of your last {patternSize} crash points
          </p>
        </div>
      )}
    </div>
  );
};

export default AITrainer;