import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Delete } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            // Timer finished - vibrate and alert
            if (navigator.vibrate) {
              navigator.vibrate([500, 200, 500, 200, 500]);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNumberInput = (num: string) => {
    if (inputTime.length < 6) {
      setInputTime(inputTime + num);
    }
  };

  const handleBackspace = () => {
    setInputTime(inputTime.slice(0, -1));
  };

  const parseInputTime = (input: string) => {
    const paddedInput = input.padStart(6, '0');
    const hours = parseInt(paddedInput.slice(0, 2));
    const minutes = parseInt(paddedInput.slice(2, 4));
    const seconds = parseInt(paddedInput.slice(4, 6));
    return hours * 3600 + minutes * 60 + seconds;
  };

  const start = () => {
    if (inputTime) {
      const seconds = parseInputTime(inputTime);
      setTotalSeconds(seconds);
      setTimeLeft(seconds);
      setIsRunning(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const pause = () => {
    setIsRunning(false);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const reset = () => {
    setTimeLeft(0);
    setTotalSeconds(0);
    setIsRunning(false);
    setInputTime('');
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  const formatInputDisplay = (input: string) => {
    const paddedInput = input.padStart(6, '0');
    return `${paddedInput.slice(0, 2)}:${paddedInput.slice(2, 4)}:${paddedInput.slice(4, 6)}`;
  };

  const getProgress = () => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const numberPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0']
  ];

  return (
    <div className="text-white text-center max-w-md w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-center space-x-3">
        <Timer className="w-8 h-8 text-red-400" />
        <h1 className="text-2xl font-bold text-red-400">Countdown Timer</h1>
      </div>

      {/* Progress Ring */}
      {totalSeconds > 0 && (
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ef4444"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      )}

      {/* Time Input Display */}
      {totalSeconds === 0 && (
        <div className="space-y-4">
          <div className="text-5xl font-mono font-bold text-red-300 min-h-[4rem] flex items-center justify-center">
            {inputTime ? formatInputDisplay(inputTime) : '00:00:00'}
          </div>
          <div className="text-sm text-red-200">
            Hours : Minutes : Seconds
          </div>
        </div>
      )}

      {/* Number Pad */}
      {totalSeconds === 0 && (
        <div className="space-y-4">
          {numberPad.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-4">
              {row.map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-xl text-2xl font-bold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  {num}
                </button>
              ))}
            </div>
          ))}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBackspace}
              className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-xl text-xl font-bold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center space-x-6">
        {totalSeconds === 0 ? (
          <button
            onClick={start}
            disabled={!inputTime}
            className="flex items-center justify-center w-20 h-20 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400/50 shadow-lg"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        ) : (
          <>
            {!isRunning ? (
              <button
                onClick={() => {
                  setIsRunning(true);
                  if (navigator.vibrate) navigator.vibrate(50);
                }}
                disabled={timeLeft === 0}
                className="flex items-center justify-center w-20 h-20 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400/50 shadow-lg"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center justify-center w-20 h-20 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-lg"
              >
                <Pause className="w-8 h-8 text-white" />
              </button>
            )}
            
            <button
              onClick={reset}
              className="flex items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-400/50 shadow-lg"
            >
              <RotateCcw className="w-8 h-8 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Timer Complete Alert */}
      {timeLeft === 0 && totalSeconds > 0 && (
        <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 animate-pulse">
          <div className="text-green-400 font-bold text-lg">⏰ Timer Complete!</div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;