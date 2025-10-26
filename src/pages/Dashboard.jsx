import { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaSearch, FaFilter, FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import api from '../services/auth';
import '../App.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueData, setIssueData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
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
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.user_type === 'landlord') {
        // Fetch landlord data
        const [propertiesRes, paymentsRes, notificationsRes] = await Promise.all([
          api.get('/properties/landlord'),
          api.get('/payments/landlord'),
          api.get('/notifications/landlord')
        ]);
        setProperties(propertiesRes.data.properties || []);
        setPayments(paymentsRes.data.payments || []);
        setNotifications(notificationsRes.data.notifications || []);
      } else {
        // Fetch tenant data
        const [bookingsRes, paymentsRes, issuesRes, notificationsRes] = await Promise.all([
          api.get('/bookings/tenant'),
          api.get('/payments/tenant'),
          api.get('/issues/tenant'),
          api.get('/notifications/tenant')
        ]);
        setBookings(bookingsRes.data.bookings || []);
        setPayments(paymentsRes.data.payments || []);
        setIssues(issuesRes.data.issues || []);
        setNotifications(notificationsRes.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use demo data as fallback
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    if (user?.user_type === 'landlord') {
      setProperties([
        { id: 1, name: 'Modern Apartment', location: 'Westlands', status: 'occupied', rent_amount: 25000 },
        { id: 2, name: 'Studio Unit', location: 'Kilimani', status: 'vacant', rent_amount: 15000 }
      ]);
      setPayments([
        { id: 1, amount: 25000, status: 'paid', date: '2024-01-15', tenant: 'John Doe' },
        { id: 2, amount: 15000, status: 'pending', date: '2024-01-15', tenant: 'Jane Smith' }
      ]);
      setNotifications([
        { id: 1, message: 'New booking request for Modern Apartment', type: 'booking', date: '2024-01-15' },
        { id: 2, message: 'Payment received from John Doe', type: 'payment', date: '2024-01-14' }
      ]);
    } else {
      setBookings([{ id: 1, property_name: 'Modern Apartment', status: 'confirmed', move_in_date: '2024-02-01' }]);
      setPayments([
        { id: 1, amount: 25000, status: 'paid', date: '2024-01-15', property: 'Modern Apartment' },
        { id: 2, amount: 25000, status: 'paid', date: '2023-12-15', property: 'Modern Apartment' }
      ]);
      setIssues([
        { id: 1, title: 'Leaky faucet', description: 'Kitchen faucet is leaking', status: 'resolved', date: '2024-01-10', priority: 'low' },
        { id: 2, title: 'Broken light', description: 'Living room light not working', status: 'pending', date: '2024-01-12', priority: 'medium' }
      ]);
      setNotifications([
        { id: 1, message: 'Your booking for Modern Apartment has been confirmed', type: 'booking', date: '2024-01-15' },
        { id: 2, message: 'Maintenance request update', type: 'issue', date: '2024-01-14' }
      ]);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/issues', issueData);
      alert('Issue reported successfully!');
      setShowIssueForm(false);
      setIssueData({ title: '', description: '', priority: 'medium' });
      // Refresh issues
      fetchDashboardData();
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Failed to report issue. Please try again.');
    }
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
      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <FaBell className="text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-blue-700">
                You have {notifications.length} new notification{notifications.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaHome className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{properties.length}</p>
              <p className="text-gray-600">Properties</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaEye className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-gray-600">Active Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaSearch className="text-purple-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">KES {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</p>
              <p className="text-gray-600">Total Payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-2xl font-bold">{issues.filter(i => i.status === 'pending').length}</p>
              <p className="text-gray-600">Open Issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaBell className="text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-600">{notification.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                notification.type === 'booking' ? 'bg-green-100 text-green-800' :
                notification.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {notification.type}
              </span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent notifications</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderTenantView = () => (
    <div className="space-y-6">
      {/* Report Issue Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Dashboard</h2>
        <button
          onClick={() => setShowIssueForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
        >
          <FaExclamationTriangle />
          Report Issue
        </button>
      </div>

      {/* Current Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
        <div className="space-y-3">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded">
              <h4 className="font-medium">{booking.property_name}</h4>
              <p className="text-sm text-gray-600">Move-in: {booking.move_in_date}</p>
              <span className={`px-2 py-1 rounded text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-gray-500 text-center py-4">No active bookings</p>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Payment History</h3>
        <div className="space-y-3">
          {payments.map(payment => (
            <div key={payment.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">{payment.property}</p>
                <p className="text-sm text-gray-600">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">KES {payment.amount?.toLocaleString()}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No payment history</p>
          )}
        </div>
      </div>

      {/* Reported Issues */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Reported Issues</h3>
        <div className="space-y-3">
          {issues.map(issue => (
            <div key={issue.id} className="p-4 border rounded">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{issue.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                  issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {issue.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{issue.date}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <p className="text-gray-500 text-center py-4">No reported issues</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderLandlordView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Landlord Dashboard</h2>

      {/* Properties Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">My Properties</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Property</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Rent</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} className="border-b">
                  <td className="p-2">{property.name}</td>
                  <td className="p-2">{property.location}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      property.status === 'occupied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-2">KES {property.rent_amount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Tracking */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Payment Tracking</h3>
        <div className="space-y-3">
          {payments.map(payment => (
            <div key={payment.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">{payment.tenant}</p>
                <p className="text-sm text-gray-600">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">KES {payment.amount?.toLocaleString()}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
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
          {user?.user_type === 'landlord' ? renderLandlordView() : renderTenantView()}
        </main>

        {/* Issue Reporting Modal */}
        {showIssueForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Report an Issue</h3>
              <form onSubmit={handleReportIssue}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Issue Title</label>
                    <input
                      type="text"
                      value={issueData.title}
                      onChange={(e) => setIssueData({...issueData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={issueData.description}
                      onChange={(e) => setIssueData({...issueData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="4"
                      placeholder="Detailed description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={issueData.priority}
                      onChange={(e) => setIssueData({...issueData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowIssueForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Report Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Issue Reporting Modal */}
        {showIssueForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Report an Issue</h3>
              <form onSubmit={handleReportIssue}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Issue Title</label>
                    <input
                      type="text"
                      value={issueData.title}
                      onChange={(e) => setIssueData({...issueData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={issueData.description}
                      onChange={(e) => setIssueData({...issueData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="4"
                      placeholder="Detailed description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={issueData.priority}
                      onChange={(e) => setIssueData({...issueData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowIssueForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Report Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;