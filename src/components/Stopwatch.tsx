import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds / 10);
    const minutes = Math.floor(totalMs / 6000);
    const seconds = Math.floor((totalMs % 6000) / 100);
    const ms = totalMs % 100;

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const start = () => {
    setIsRunning(true);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const pause = () => {
    setIsRunning(false);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  const timeDisplay = formatTime(time);

  return (
    <div className="text-center max-w-lg w-full space-y-12">
      {/* Header */}
      <div className="flex items-center justify-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded-full">
          <RotateCcw className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-green-400">Stopwatch</h1>
      </div>

      {/* Time Display */}
      <div className="space-y-2">
        <div className="font-mono text-7xl md:text-8xl font-bold text-green-400 tracking-wider animate-pulse">
          {timeDisplay.minutes}:{timeDisplay.seconds}
        </div>
        <div className="font-mono text-3xl text-green-300">
          .{timeDisplay.milliseconds}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-6">
        {!isRunning ? (
          <button
            onClick={start}
            className="group flex items-center justify-center w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400/50 shadow-lg"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="group flex items-center justify-center w-20 h-20 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-lg"
          >
            <Pause className="w-8 h-8 text-black" />
          </button>
        )}

        <button
          onClick={reset}
          className="group flex items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-400/50 shadow-lg"
        >
          <Square className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Status */}
      <div className="text-green-300 text-lg">
        {isRunning ? (
          <span className="animate-pulse">● Recording</span>
        ) : time > 0 ? (
          <span>⏸ Paused</span>
        ) : (
          <span>⏹ Ready</span>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;