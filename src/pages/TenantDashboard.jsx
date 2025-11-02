import { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt, FaExclamationTriangle, FaBell, FaCreditCard, FaClipboardList, FaTrash } from 'react-icons/fa';
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [issueData, setIssueData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [paymentData, setPaymentData] = useState({
    payment_method: 'mpesa',
    phone_number: '',
    notes: ''
  });
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/\b(\d+)\b/, (match) => {
      const day = parseInt(match);
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                    day === 2 || day === 22 ? 'nd' : 
                    day === 3 || day === 23 ? 'rd' : 'th';
      return day + suffix;
    });
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Check if user is tenant
    if (!currentUser || currentUser.user_type !== 'tenant') {
      navigate('/properties'); 
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;

      const [bookingsRes, paymentsRes, issuesRes, propertiesRes] = await Promise.all([
        api.get(`/bookings?user_id=${currentUser.id}&user_type=tenant`),
        api.get(`/payments?user_id=${currentUser.id}&user_type=tenant`),
        api.get(`/issues/tenant/${currentUser.id}`),
        api.get('/properties')
      ]);

      // Use the correct response structure from backend and ensure arrays
      
      const bookingsData = Array.isArray(bookingsRes.data?.bookings) ? bookingsRes.data.bookings : [];
      const paymentsData = Array.isArray(paymentsRes.data?.payments) ? paymentsRes.data.payments : [];
      const issuesData = Array.isArray(issuesRes.data?.data) ? issuesRes.data.data : [];
      const propertiesData = Array.isArray(propertiesRes.data?.data) ? propertiesRes.data.data : [];
      
      setBookings(bookingsData);
      setPayments(paymentsData);
      setProperties(propertiesData);
      setIssues(issuesData);
      
      // Fetch notifications for tenant
      try {
        const notificationsRes = await api.get(`/notifications?user_id=${currentUser.id}`);
        setNotifications(notificationsRes.data.notifications || []);
      } catch (notifError) {
        console.error('Failed to fetch notifications:', notifError);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        alert('You must be logged in to report an issue.');
        return;
      }

      // Get property_id from first booking if available
      const propertyId = Array.isArray(bookings) && bookings.length > 0 ? bookings[0].property_id : null;
      if (!propertyId) {
        alert('You need to have an active booking to report an issue.');
        return;
      }

      const issuePayload = {
        user_id: currentUser.id,
        property_id: propertyId,
        title: issueData.title,
        description: issueData.description,
        priority: issueData.priority,
        issue_type: 'maintenance'
      };

      await api.post('/issues', issuePayload);
      alert('Issue reported successfully!');
      setShowIssueForm(false);
      setIssueData({ title: '', description: '', priority: 'medium' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error reporting issue:', error);
      const errorMessage = error.response?.data?.error || 'Failed to report issue';
      alert(`Error: ${errorMessage}`);
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
    <div className="min-h-screen bg-gray-100 flex">
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
      <div className="lg:ml-10 w-full">
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-600 relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaBell className="text-xl" />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.is_read).length > 9 ? '9+' : notifications.filter(n => !n.is_read).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <button
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Welcome back, {user?.first_name || 'Tenant'}!
              </div>
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
                  <p className="text-2xl font-bold">KES {payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toLocaleString()}</p>
                  <p className="text-gray-600">Total Payments</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{issues.filter(i => i.status !== 'resolved' && i.status !== 'RESOLVED').length}</p>
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

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Dashboard</h2>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const confirmedBooking = bookings.find(b => b.status === 'confirmed');
                  if (confirmedBooking) {
                    setSelectedBooking(confirmedBooking);
                    setShowPaymentForm(true);
                  } else {
                    alert('You need a confirmed booking to make a payment.');
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <FaCreditCard />
                Make Payment
              </button>
              <button
                onClick={() => setShowIssueForm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <FaExclamationTriangle />
                Report Issue
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{booking.property_title || `Property #${booking.property_id}`}</h4>
                        <p className="text-sm text-gray-600">Start: {formatDate(booking.start_date)}</p>
                        <p className="text-sm text-gray-600">End: {formatDate(booking.end_date)}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowPaymentForm(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Pay Rent
                          </button>
                        )}
                        {booking.status === 'pending' && (
                          <span className="px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded">
                            Awaiting Confirmation
                          </span>
                        )}
                      </div>
                    </div>
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
                      <p className="font-medium">{payment.property_title || `Property #${payment.property_id}`}</p>
                      <p className="text-sm text-gray-600">{formatDate(payment.due_date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KES {parseFloat(payment.amount)?.toLocaleString()}</p>
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
                        issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">{issue.property_title || `Property #${issue.property_id}`}</p>
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

        {/* Payment Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Make Payment</h3>
              {selectedBooking && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Property: {selectedBooking.property_title || `#${selectedBooking.property_id}`}</p>
                  <p className="text-sm text-gray-600">Booking: {formatDate(selectedBooking.start_date)} to {formatDate(selectedBooking.end_date)}</p>
                </div>
              )}
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const currentUser = authService.getCurrentUser();
                  if (!selectedBooking) {
                    alert('No booking selected.');
                    return;
                  }
                  
                  const dueDate = new Date();
                  dueDate.setDate(dueDate.getDate() + 30);
                  
                  const paymentPayload = {
                    user_id: currentUser.id,
                    property_id: selectedBooking.property_id,
                    amount: 25000, // Should come from property rent amount
                    due_date: dueDate.toISOString().replace('Z', '').replace(/\d{3}$/, '123456'),
                    payment_method: paymentData.payment_method,
                    notes: paymentData.notes || `Rental payment for Property #${selectedBooking.property_id}`
                  };
                  
                  await api.post('/payments', paymentPayload);
                  
                  try {
                    const propertyRes = await api.get(`/properties/${selectedBooking.property_id}`);
                    const propertyData = propertyRes.data.property;
                    
                    if (propertyData && propertyData.landlord_id) {
                      await api.post('/notifications', {
                        title: 'New Payment Received',
                        message: `Payment of KES 25,000 received for ${selectedBooking.property_title || `Property #${selectedBooking.property_id}`} from ${currentUser.first_name} ${currentUser.last_name}`,
                        user_id: propertyData.landlord_id,
                        property_id: selectedBooking.property_id,
                        type: 'general'
                      });
                    }
                  } catch (notifError) {
                    console.error('Notification creation failed:', notifError);
                  }
                  
                  alert('Payment created successfully!');
                  setShowPaymentForm(false);
                  setPaymentData({ payment_method: 'mpesa', phone_number: '', notes: '' });
                  fetchDashboardData();
                } catch (error) {
                  console.error('Payment error:', error);
                  const errorMessage = error.response?.data?.error || 'Failed to create payment. Please try again.';
                  alert(errorMessage);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                      value={paymentData.payment_method}
                      onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="mpesa">M-Pesa</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  {paymentData.payment_method === 'mpesa' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
                      <input
                        type="tel"
                        value={paymentData.phone_number}
                        onChange={(e) => setPaymentData({...paymentData, phone_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="0712345678"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="Payment notes..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create Payment
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

export default TenantDashboard;