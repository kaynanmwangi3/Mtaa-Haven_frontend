import { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt, FaExclamationTriangle, FaBell, FaCreditCard, FaClipboardList } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import api from '../services/auth';

function TenantDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueData, setIssueData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Check if user is tenant
    if (!currentUser || currentUser.user_type !== 'tenant') {
      navigate('/properties'); // Redirect non-tenants
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsRes, paymentsRes, issuesRes, notificationsRes] = await Promise.all([
        api.get('/bookings/tenant'),
        api.get('/payments/tenant'),
        api.get('/issues/tenant'),
        api.get('/notifications/tenant')
      ]);

      // Backend returns data in different structure
      setBookings(bookingsRes.data.data || []);
      setPayments(paymentsRes.data.data || []);
      setIssues(issuesRes.data.data || []);
      setNotifications(notificationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      // Load demo data as fallback
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
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
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    try {
      const issuePayload = {
        title: issueData.title,
        description: issueData.description,
        issue_type: 'MAINTENANCE', // Backend expects issue_type enum
        property_id: 1, // TODO: Get from current booking/property
        priority: issueData.priority.toUpperCase()
      };

      await api.post('/issues', issuePayload);
      alert('Issue reported successfully!');
      setShowIssueForm(false);
      setIssueData({ title: '', description: '', priority: 'medium' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Failed to report issue. Please try again.');
    }
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
            <Link
              to="/dashboard"
              className="w-full text-left px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white block"
            >
              <FaHome className="inline mr-3" />
              Dashboard
            </Link>
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
              <h1 className="text-2xl font-bold text-gray-800">Tenant Dashboard</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome back, {user?.first_name || 'Tenant'}!
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <FaExclamationTriangle className="text-red-400 mr-3" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Notifications Banner */}
          {notifications.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaClipboardList className="text-blue-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-gray-600">Active Bookings</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaCreditCard className="text-green-500 text-2xl mr-3" />
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaBell className="text-purple-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-gray-600">Notifications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Issue Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Dashboard</h2>
            <button
              onClick={() => setShowIssueForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <FaExclamationTriangle />
              Report Issue
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded">
                    <h4 className="font-medium">Property #{booking.property_id}</h4>
                    <p className="text-sm text-gray-600">Start: {booking.start_date}</p>
                    <p className="text-sm text-gray-600">End: {booking.end_date}</p>
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                      <p className="font-medium">Property #{payment.property_id}</p>
                      <p className="text-sm text-gray-600">{payment.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KES {payment.amount?.toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded text-sm ${
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Reported Issues</h3>
              <div className="space-y-3">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 border rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{issue.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        issue.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">{issue.created_at}</p>
                      <span className={`px-2 py-1 rounded text-sm ${
                        issue.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
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

export default TenantDashboard;