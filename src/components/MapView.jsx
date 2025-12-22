export default function MapView({ districts, onSelectDistrict }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 backdrop-blur">
        <h2 className="text-3xl font-bold mb-2">Welcome to MystiQ City</h2>
        <p className="text-gray-300">Explore districts, meet characters, and complete quests</p>
      </div>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((district) => (
          <div key={district.id} onClick={() => onSelectDistrict(district)} className="group relative overflow-hidden rounded-xl cursor-pointer">
            {/* Component content */}
          </div>
        ))}
      </div>
    </div>
  )
}