export default function SolCard({ sol, temperature }) {
  return (
    <div className="bg-gray-700 bg-opacity-60 rounded-lg p-4 shadow-md text-white">
      <h3 className="text-xl font-semibold mb-2">Sol {sol}</h3>
      <p className="text-md">Temperature: {temperature ? `${temperature} K` : 'No data available'}</p>
    </div>
  );
}
