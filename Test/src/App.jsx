import ImageSlider from './components/ImageSlider';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-400 text-white">
      {/* Overlay entfernt bzw. hinterlegt */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen text-center pt-[20vh] px-4">
        {/* ImageSlider (mit Suchfunktion und Navigation) */}
        <ImageSlider />

        {/* Wetterdaten unter dem Slider */}
        <div className="mt-12 w-full flex justify-center">
          <WeatherCard />
        </div>
      </div>

      {/* Optionaler Hintergrund-Overlay, aber nicht klick-blockierend */}
      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none -z-10"></div>
    </div>
  );
}

export default App;
