import { useState, useEffect } from 'react';
import { FaHome, FaUsers, FaExclamationTriangle, FaCreditCard, FaBars, FaTimes, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import api from '../services/auth';
import '../App.css';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';  
import AddPropertyForm from '../components/AddPropertyForm.jsx';

function LandlordDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (!currentUser || currentUser.user_type !== 'landlord') {
      navigate('/dashboard');
      return;
    }

    fetchDashboardData(currentUser.id);
  }, [navigate]);

  const fetchDashboardData = async (landlordId) => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes, issuesRes] = await Promise.all([
        api.get(`/properties/landlord/${landlordId}`),
        api.get(`/bookings/landlord/${landlordId}`),
        api.get(`/issues/landlord/${landlordId}`)
      ]);

      setProperties(propertiesRes.data.data || []);
      console.log("Bookings Data:", propertiesRes.data.data);
      setBookings(bookingsRes.data.data || []);
      setIssues(issuesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // // Load demo data as fallback
      // setProperties([
      //   { id: 1, title: 'Modern Apartment', rent_amount: 25000, status: 'available', city: 'Westlands' },
      //   { id: 2, title: 'Studio Unit', rent_amount: 15000, status: 'occupied', city: 'Kilimani' }
      // ]);
      // setBookings([
      //   { id: 1, property_id: 1, tenant_id: 1, status: 'confirmed', start_date: '2024-01-15' }
      // ]);
      // setIssues([
      //   { id: 1, title: 'Leaky faucet', description: 'Kitchen faucet needs repair', status: 'open', priority: 'medium', property_id: 1 }
      // ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIssue = async (issueId) => {
    try {
      await api.patch(`/issues/${issueId}/resolve`);
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, status: 'resolved' } : issue
      ));
      alert('Issue marked as resolved!');
    } catch (error) {
      console.error('Error resolving issue:', error);
      alert('Failed to resolve issue. Please try again.');
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await api.patch(`/payments/confirm/${paymentId}`);
      alert('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalProperties = properties.length;
  const pendingIssues = issues.filter(i => i.status === 'open').length;
  const newBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = properties.reduce((sum, p) => sum + p.rent_amount, 0);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed flex-col pb-20  inset-y-0 left-0 z-50 w-64  bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
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
            <div className="w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white">
              <FaHome className="inline mr-3" />
              Landlord Dashboard
            </div>
          </div>
        </nav>

        <div>
          <Link
            to="/profile"
            className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 block"
          >
            <FaUser className="inline mr-3" />
            Profile Settings
        </Link>
        </div>

        <div>
          <button
          
            onClick={() => setShowForm(!showForm)}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 block"
          >
            {showForm ? 'Close Form' : 'Add New Property'}
          </button>
          {showForm && (
        <div className="mt-6">
          <AddPropertyForm
            onSuccess={(data) => {
              console.log("New property created:", data);
              setShowForm(false);
            }}
          />
        </div>
      )}
        </div>

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
      <div className="lg:ml-10  w-full ">
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
              <h1 className="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome back, {user?.first_name || 'Landlord'}!
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaHome className="text-blue-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalProperties}</p>
                  <p className="text-gray-600">Total Properties</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaUsers className="text-green-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{newBookings}</p>
                  <p className="text-gray-600">New Bookings</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{pendingIssues}</p>
                  <p className="text-gray-600">Pending Issues</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaCreditCard className="text-purple-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
                  <p className="text-gray-600">Monthly Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Properties List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">My Properties</h3>
              <div className="space-y-3">
                {properties.map(property => (
                  <div key={property.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-sm text-gray-600">{property.city}</p>
                        <p className="text-sm font-medium text-green-600">KES {property.rent_amount?.toLocaleString()}/month</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        property.status === 'occupied' ? 'bg-green-100 text-green-800' : 
                        property.status === 'available' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No properties found</p>
                )}
              </div>
            </div>

            {/* New Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">New Bookings</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Property #{booking.property_id}</p>
                        <p className="text-sm text-gray-600">Tenant ID: {booking.tenant_id}</p>
                        <p className="text-sm text-gray-600">Start: {booking.start_date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No new bookings</p>
                )}
              </div>
            </div>

            {/* Reported Issues */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Reported Issues</h3>
              <div className="space-y-4">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{issue.title}</h4>
                        <p className="text-gray-600 mb-2">{issue.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Property #{issue.property_id}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                            issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.priority} priority
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.status}
                        </span>
                        {issue.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolveIssue(issue.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center gap-1"
                          >
                            <FaCheck className="text-xs" />
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {issues.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No reported issues</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandlordDashboard;