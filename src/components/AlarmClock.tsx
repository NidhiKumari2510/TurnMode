import React, { useState, useEffect } from 'react';
import { Clock, AlarmClock as AlarmIcon, Bell } from 'lucide-react';

const AlarmClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check if alarm should ring
      if (isAlarmEnabled && !isAlarmRinging) {
        const currentTimeString = now.toTimeString().slice(0, 5);
        if (currentTimeString === alarmTime) {
          setIsAlarmRinging(true);
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alarmTime, isAlarmEnabled, isAlarmRinging]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stopAlarm = () => {
    setIsAlarmRinging(false);
  };

  return (
    <div className="text-white text-center max-w-md w-full space-y-8">
      {/* Current Time Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-blue-400">Alarm Clock</h1>
        </div>
        
        <div className="text-6xl md:text-7xl font-mono font-bold tracking-wider">
          {formatTime(currentTime)}
        </div>
        
        <div className="text-lg text-blue-200">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Alarm Controls */}
      <div className="space-y-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center justify-center space-x-2">
          <AlarmIcon className="w-6 h-6 text-blue-300" />
          <h2 className="text-xl font-semibold text-blue-300">Set Alarm</h2>
        </div>
        
        <div className="space-y-4">
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="w-full px-4 py-3 text-2xl font-mono text-center bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          
          <div className="flex items-center justify-center space-x-4">
            <span className="text-lg">Alarm</span>
            <button
              onClick={() => setIsAlarmEnabled(!isAlarmEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                isAlarmEnabled ? 'bg-blue-500' : 'bg-white/30'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                  isAlarmEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAlarmEnabled ? 'text-blue-400' : 'text-white/70'}`}>
              {isAlarmEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
          
          {isAlarmEnabled && (
            <div className="text-sm text-blue-200 animate-pulse">
              Alarm set for {alarmTime}
            </div>
          )}
        </div>
      </div>

      {/* Alarm Ringing Modal */}
      {isAlarmRinging && (
        <div className="fixed inset-0 bg-red-500/90 flex items-center justify-center z-50 animate-pulse">
          <div className="text-center space-y-6">
            <Bell className="w-24 h-24 text-white mx-auto animate-bounce" />
            <h2 className="text-4xl font-bold text-white">ALARM!</h2>
            <button
              onClick={stopAlarm}
              className="px-8 py-4 bg-white text-red-500 text-xl font-bold rounded-2xl hover:bg-red-50 transition-colors duration-200 transform hover:scale-105"
            >
              Stop Alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmClock;