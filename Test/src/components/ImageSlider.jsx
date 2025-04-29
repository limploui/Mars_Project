import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';

const NASA_API_KEY = 'ZtKCVrCkBcUYJO5NoMcbydCKrZwYAvMdfihuhcjX';

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [imagesBySol, setImagesBySol] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchSol, setSearchSol] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);

  async function fetchWeatherData() {
    try {
      const res = await fetch(
        `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`
      );
      if (!res.ok) throw new Error('Fehler beim Abrufen der Wetterdaten');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  async function fetchImages(weatherData) {
    setLoading(true);
    setError(null);
    try {
      const solKeys = weatherData.sol_keys;
      const results = await Promise.all(
        solKeys.map(async (sol) => {
          const res = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${NASA_API_KEY}`
          );
          if (!res.ok) throw new Error(`Fehler beim Abrufen der Bilder für Sol ${sol}`);
          const data = await res.json();
          return { sol: sol.toString(), images: data.photos };
        })
      );

      const validResults = results.filter(
        (group) => group.images.length > 0 && weatherData[group.sol]
      );

      const seen = new Set();
      const unique = validResults.filter((group) => {
        const img = group.images[0];
        if (!seen.has(img.img_src)) {
          seen.add(img.img_src);
          return true;
        }
        return false;
      });

      setImagesBySol(unique);
      setFilteredImages(unique);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const weather = await fetchWeatherData();
      if (weather) await fetchImages(weather);
    }
    init();
  }, []);

  const handleSearch = () => {
    if (!searchSol.trim()) {
      setFilteredImages(imagesBySol);
      return;
    }
    const filtered = imagesBySol.filter((group) => group.sol === searchSol.trim());
    setFilteredImages(filtered);
    setCurrent(0);
  };

  const handleNext = () => {
    if (filteredImages.length > 0) {
      setCurrent((prev) => (prev + 1) % filteredImages.length);
    }
  };

  const handlePrev = () => {
    if (filteredImages.length > 0) {
      setCurrent((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  if (loading) return <div className="text-center mt-10">Lade …</div>;
  if (error) return <div className="text-center text-red-600 mt-10">Fehler: {error}</div>;
  if (filteredImages.length === 0) return <div className="text-center mt-10">Keine Bilder verfügbar.</div>;

  return (
    <div className="w-screen h-screen flex flex-col bg-black text-white">
      {/* Header / Suchleiste */}
      <div className="flex justify-center items-center p-6 bg-gradient-to-r from-orange-100 to-orange-400">
        <input
          type="text"
          placeholder="Suche Sol 675-679 (Nummer)"
          value={searchSol}
          onChange={(e) => setSearchSol(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2 text-black w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Suchen
        </button>
      </div>

      {/* Hauptinhalt: Bild + Wetter */}
      <div className="flex-1 relative overflow-hidden">
        {filteredImages.map((group, index) => (
          <div
            key={group.sol}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={group.images[0].img_src}
              alt={`Mars Slide Sol ${group.sol}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <h1 className="text-5xl font-bold drop-shadow-md">Mars Project – Sol {group.sol}</h1>
              <div className="mt-4">
                <WeatherCard
                  current={current}
                  images={filteredImages.map((group) => ({
                    sol: group.sol,
                    img_src: group.images[0].img_src,
                  }))}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Slider-Buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-opacity-80"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-opacity-80"
        >
          →
        </button>
      </div>
    </div>
  );
}
