import { useState, useEffect } from 'react';
import SolCard from './SolCard';

const NASA_API_KEY = 'ZtKCVrCkBcUYJO5NoMcbydCKrZwYAvMdfihuhcjX';

export default function WeatherCard({ current, images }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wetterdaten abrufen
  async function fetchWeather() {
    try {
      const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
      const res = await fetch(url);

      if (!res.ok) throw new Error('API-Fehler');

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data?.sol_keys) {
    return null; // Keine Anzeige, wenn keine Wetterdaten verfügbar sind
  }

  if (!images || images.length === 0) {
    return null; // Keine Anzeige, wenn keine Bilder verfügbar sind
  }

  const currentImage = images[current];
  if (!currentImage) {
    return null; // Keine Anzeige, wenn kein aktuelles Bild verfügbar ist
  }

  const currentSol = currentImage.sol;

  if (!currentSol || !data[currentSol]) {
    return null; // Keine Anzeige, wenn keine Wetterdaten für den aktuellen `sol` verfügbar sind
  }

  const weatherData = data[currentSol];
  const temperature = weatherData?.AT?.av;

  return (
    <div className="p-6 w-full max-w-6xl">
      {/* Mars Project Text mit schwarzer Farbe */}
            {currentSol && temperature ? (
        <SolCard sol={currentSol} temperature={temperature} />
      ) : null}
    </div>
  );
}