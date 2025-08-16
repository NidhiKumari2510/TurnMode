import React from 'react';
import { RotateCw, Clock, Timer, Cloud } from 'lucide-react';

interface OrientationIndicatorProps {
  orientation: string;
}

const OrientationIndicator: React.FC<OrientationIndicatorProps> = ({ orientation }) => {
  const getIcon = () => {
    switch (orientation) {
      case 'portrait-primary':
        return <Clock className="w-4 h-4" />;
      case 'landscape-primary':
        return <RotateCw className="w-4 h-4" />;
      case 'portrait-secondary':
        return <Timer className="w-4 h-4" />;
      case 'landscape-secondary':
        return <Cloud className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMode = () => {
    switch (orientation) {
      case 'portrait-primary':
        return 'Alarm';
      case 'landscape-primary':
        return 'Stopwatch';
      case 'portrait-secondary':
        return 'Timer';
      case 'landscape-secondary':
        return 'Weather';
      default:
        return 'Alarm';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium z-10">
      {getIcon()}
      <span>{getMode()}</span>
    </div>
  );
};

export default OrientationIndicator;