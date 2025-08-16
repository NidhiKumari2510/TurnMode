import React, { useState, useEffect } from 'react';
import AlarmClock from './components/AlarmClock';
import Stopwatch from './components/Stopwatch';
import CountdownTimer from './components/CountdownTimer';
import Weather from './components/Weather';
import OrientationIndicator from './components/OrientationIndicator';

type OrientationType = 'portrait-primary' | 'landscape-primary' | 'portrait-secondary' | 'landscape-secondary';

function App() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-primary');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const detectOrientation = (): OrientationType => {
    if (screen.orientation && screen.orientation.type) {
      return screen.orientation.type as OrientationType;
    }
    
    // Fallback for older browsers
    const angle = window.orientation || 0;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width > height) {
      return angle === 90 ? 'landscape-primary' : 'landscape-secondary';
    } else {
      return angle === 180 ? 'portrait-secondary' : 'portrait-primary';
    }
  };

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsTransitioning(true);
      
      // Add a small delay to ensure proper orientation detection
      setTimeout(() => {
        const newOrientation = detectOrientation();
        setOrientation(newOrientation);
        
        // Vibration feedback if supported
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        setTimeout(() => setIsTransitioning(false), 150);
      }, 100);
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Set initial orientation
    setOrientation(detectOrientation());

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const renderCurrentMode = () => {
    switch (orientation) {
      case 'portrait-primary':
        return <AlarmClock />;
      case 'landscape-primary':
        return <Stopwatch />;
      case 'portrait-secondary':
        return <CountdownTimer />;
      case 'landscape-secondary':
        return <Weather />;
      default:
        return <AlarmClock />;
    }
  };

  const getBackgroundClass = () => {
    switch (orientation) {
      case 'portrait-primary':
        return 'bg-gradient-to-br from-slate-900 to-blue-900';
      case 'landscape-primary':
        return 'bg-black';
      case 'portrait-secondary':
        return 'bg-gradient-to-br from-red-900 to-red-700';
      case 'landscape-secondary':
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-br from-slate-900 to-blue-900';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${getBackgroundClass()}`}>
      <div className={`min-h-screen flex items-center justify-center p-4 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {renderCurrentMode()}
      </div>
      <OrientationIndicator orientation={orientation} />
    </div>
  );
}

export default App;