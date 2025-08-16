import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Thermometer, MapPin, Wifi, WifiOff } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Replace with your actual OpenWeatherMap API key
  const OWM_API_KEY = "YOUR_OPENWEATHER_API_KEY";
  const DEFAULT_CITY = "London";

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        fetchWeather();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    fetchWeather();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      let weatherUrl;
      
      // Try to get user's location
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: true
            });
          });
          
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${OWM_API_KEY}&units=metric`;
        } catch (geoError) {
          // Fallback to default city
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${OWM_API_KEY}&units=metric`;
        }
      } else {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${OWM_API_KEY}&units=metric`;
      }

      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      setWeather({
        location: data.name + (data.sys.country ? `, ${data.sys.country}` : ''),
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      
      // Show demo data when API fails
      setWeather({
        location: "Demo Location",
        temperature: 22,
        condition: "Clear",
        description: "clear sky",
        humidity: 65,
        windSpeed: 15
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-20 h-20 text-yellow-300" />;
      case 'clouds':
        return <Cloud className="w-20 h-20 text-gray-200" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-20 h-20 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-20 h-20 text-white" />;
      default:
        return <Cloud className="w-20 h-20 text-gray-200" />;
    }
  };

  if (!isOnline) {
    return (
      <div className="text-white text-center max-w-md w-full space-y-8">
        <div className="space-y-4">
          <WifiOff className="w-16 h-16 text-white/60 mx-auto" />
          <h1 className="text-2xl font-bold">Offline</h1>
          <p className="text-white/80">Connect to the internet to view weather</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white text-center max-w-md w-full space-y-8">
        <div className="animate-spin">
          <Cloud className="w-16 h-16 text-white/60 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold">Loading Weather...</h1>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="text-white text-center max-w-md w-full space-y-8">
        <div className="space-y-4">
          <Cloud className="w-16 h-16 text-red-300 mx-auto" />
          <h1 className="text-2xl font-bold text-red-300">Weather Unavailable</h1>
          <p className="text-white/80 text-sm">{error}</p>
          <button
            onClick={fetchWeather}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white text-center max-w-md w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-center space-x-3">
        <Wifi className="w-8 h-8 text-blue-200" />
        <h1 className="text-2xl font-bold">Weather Today</h1>
      </div>

      {weather && (
        <>
          {/* Location */}
          <div className="flex items-center justify-center space-x-2 text-blue-100">
            <MapPin className="w-5 h-5" />
            <span className="text-lg font-medium">{weather.location}</span>
          </div>

          {/* Weather Icon and Temperature */}
          <div className="space-y-6">
            <div className="flex justify-center animate-bounce">
              {getWeatherIcon(weather.condition)}
            </div>
            
            <div className="space-y-2">
              <div className="text-7xl font-bold font-mono">
                {weather.temperature}°
              </div>
              <div className="text-xl capitalize text-blue-100">
                {weather.description}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Thermometer className="w-5 h-5 text-blue-300" />
                <span className="text-sm text-blue-200">Humidity</span>
              </div>
              <div className="text-2xl font-bold">{weather.humidity}%</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-300" />
                <span className="text-sm text-blue-200">Wind</span>
              </div>
              <div className="text-2xl font-bold">{weather.windSpeed} km/h</div>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchWeather}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center space-x-2 mx-auto"
          >
            <Cloud className="w-5 h-5" />
            <span>Refresh</span>
          </button>

          {/* API Notice */}
          {error && (
            <div className="text-xs text-blue-200 bg-blue-500/20 rounded-lg p-2">
              Demo mode - Add your OpenWeatherMap API key for live data
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Weather;