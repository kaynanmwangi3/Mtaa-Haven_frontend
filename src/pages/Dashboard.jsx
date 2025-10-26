import { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaSearch, FaFilter, FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import '../App.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [recentViews, setRecentViews] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const navigate = useNavigate();

  // Demo data
  const demoProperties = [
    {
      id: 1,
      name: "Modern 2BR Apartment",
      rent_amount: 25000,
      bedrooms: 2,
      bathrooms: 1,
      location: "Westlands, Nairobi",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800",
      type: "Apartment"
    },
    {
      id: 2,
      name: "Cozy Studio Unit",
      rent_amount: 15000,
      bedrooms: 1,
      bathrooms: 1,
      location: "Kilimani, Nairobi",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800",
      type: "Studio"
    },
    {
      id: 3,
      name: "Spacious 3BR House",
      rent_amount: 45000,
      bedrooms: 3,
      bathrooms: 2,
      location: "Karen, Nairobi",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800",
      type: "House"
    }
  ];

  useEffect(() => {
    // Load user data from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Demo recent views and search history
    setRecentViews(demoProperties.slice(0, 2));
    setSearchHistory([
      { query: '2 bedroom apartment westlands', timestamp: new Date() },
      { query: 'affordable studio', timestamp: new Date(Date.now() - 86400000) },
      { query: 'house karen', timestamp: new Date(Date.now() - 172800000) }
    ]);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleFavorite = (propertyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
  };

  const addToComparison = (property) => {
    if (comparisonList.length < 3 && !comparisonList.find(p => p.id === property.id)) {
      setComparisonList([...comparisonList, property]);
    }
  };

  const removeFromComparison = (propertyId) => {
    setComparisonList(comparisonList.filter(p => p.id !== propertyId));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaHeart className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{favorites.size}</p>
              <p className="text-gray-600">Saved Properties</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaEye className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{recentViews.length}</p>
              <p className="text-gray-600">Recent Views</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaSearch className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{searchHistory.length}</p>
              <p className="text-gray-600">Search History</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaFilter className="text-purple-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{comparisonList.length}</p>
              <p className="text-gray-600">In Comparison</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentViews.map((property, index) => (
            <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img src={property.image} alt={property.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                <div>
                  <p className="font-medium">{property.name}</p>
                  <p className="text-sm text-gray-600">KES {property.rent_amount.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/properties')}
                className="text-blue-600 hover:text-blue-800"
              >
                View Again
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Saved Properties</h2>
      {favorites.size === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No saved properties yet</p>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProperties.filter(property => favorites.has(property.id)).map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={property.image} alt={property.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                <p className="text-green-600 font-bold mb-2">KES {property.rent_amount.toLocaleString()}</p>
                <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaHeart className="text-xl fill-current" />
                  </button>
                  <button
                    onClick={() => addToComparison(property)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                    disabled={comparisonList.length >= 3}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderComparison = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Property Comparison</h2>
      {comparisonList.length === 0 ? (
        <div className="text-center py-12">
          <FaFilter className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Add properties to compare</p>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Property</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Bedrooms</th>
                <th className="p-4 text-left">Bathrooms</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comparisonList.map(property => (
                <tr key={property.id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center">
                      <img src={property.image} alt={property.name} className="w-16 h-16 rounded-lg object-cover mr-3" />
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-green-600">KES {property.rent_amount.toLocaleString()}</td>
                  <td className="p-4">{property.bedrooms}</td>
                  <td className="p-4">{property.bathrooms}</td>
                  <td className="p-4">{property.location}</td>
                  <td className="p-4">
                    <button
                      onClick={() => removeFromComparison(property.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Mtaa Haven</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaHome className="inline mr-3" />
              Overview
            </button>
            <button
              onClick={() => { setActiveTab('favorites'); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaHeart className="inline mr-3" />
              Saved Properties
            </button>
            <button
              onClick={() => { setActiveTab('comparison'); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'comparison' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaFilter className="inline mr-3" />
              Compare Properties
            </button>
            <Link
              to="/properties"
              className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 block"
            >
              <FaSearch className="inline mr-3" />
              Browse Properties
            </Link>
            <Link
              to="/profile"
              className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 block"
            >
              <FaUser className="inline mr-3" />
              Profile Settings
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-800"
              >
                <FaBars className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'favorites' && 'Saved Properties'}
                {activeTab === 'comparison' && 'Property Comparison'}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome back, {authService.getCurrentUser()?.first_name || 'User'}!
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'comparison' && renderComparison()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;