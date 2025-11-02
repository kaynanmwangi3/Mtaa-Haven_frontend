import { useState, useEffect } from 'react';
import { FaHome, FaUsers, FaExclamationTriangle, FaCreditCard, FaBars, FaTimes, FaSignOutAlt, FaCheck, FaBell, FaTrash, FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import api from '../services/auth';
import AddPropertyForm from '../components/AddPropertyForm.jsx';
import '../App.css'

function LandlordDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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

    if (!currentUser || currentUser.user_type !== 'landlord') {
      navigate('/dashboard');
      return;
    }

    fetchDashboardData(currentUser.id);
  }, [navigate]);

  const fetchDashboardData = async (landlordId) => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes, issuesRes, notificationsRes, paymentsRes] = await Promise.all([
        api.get(`/properties/landlord/${landlordId}`),
        api.get(`/bookings/landlord/${landlordId}`),
        api.get(`/issues/landlord/${landlordId}`),
        api.get(`/notifications?user_id=${landlordId}`),
        api.get(`/payments?user_type=landlord&user_id=${landlordId}`)
      ]);
      const allProperties = propertiesRes.data.data || [];
      const bookingsData = bookingsRes.data.data || [];
      
      // Show all landlord properties
      setProperties(allProperties);
      setBookings(bookingsData);
      setIssues(issuesRes.data.data || []);
      const notificationsData = notificationsRes.data.notifications || [];
      setNotifications(notificationsData);
      
      // Calculate revenue from all completed payments
      const paymentsData = paymentsRes.data.payments || [];
      setPayments(paymentsData);
      
      const completedPayments = paymentsData.filter(payment => payment.status === 'completed');
      
      const totalRevenue = completedPayments.reduce((sum, payment) => { const amount = parseFloat(payment.amount || 0); return sum + amount;}, 0);
      
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      await api.patch(`/payments/${paymentId}/confirm`);
      
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        try {
          await api.post('/notifications', {
            title: 'Payment Confirmed',
            message: `Your payment of KES ${parseFloat(payment.amount).toLocaleString()} for ${payment.property_title || `Property #${payment.property_id}`} has been confirmed.`,
            user_id: payment.user_id,
            property_id: payment.property_id,
            type: 'general'
          });
        } catch (notifError) {
          console.error('Notification failed:', notifError);
        }
      }
      
      fetchDashboardData(user.id);
      alert('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        fetchDashboardData(user.id);
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/confirm`);
      
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        try {
          await api.post('/notifications', {
            title: 'Booking Confirmed',
            message: `Your booking for ${booking.property_title || `Property #${booking.property_id}`} has been confirmed by the landlord.`,
            user_id: booking.tenant_id,
            property_id: booking.property_id,
            type: 'general'
          });
        } catch (notifError) {
          console.error('Notification failed:', notifError);
        }
      }
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
      alert('Booking confirmed successfully!');
      fetchDashboardData(user.id);
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
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
              // Refresh properties list to show the new property
              fetchDashboardData(user.id);
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
                Welcome back, {user?.first_name || 'Landlord'}!
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                <FaBell className="text-orange-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-gray-600">Notifications</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <FaCreditCard className="text-purple-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
                  <p className="text-gray-600">Total Revenue</p>
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
              <h3 className="text-xl font-semibold mb-4">Bookings ({bookings.length})</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{booking.property_title || `Property #${booking.property_id}`}</p>
                        <p className="text-sm text-gray-600">Tenant: {booking.tenant_first_name} {booking.tenant_last_name}</p>
                        <p className="text-sm text-gray-600">Start: {formatDate(booking.start_date)}</p>
                        <p className="text-sm text-gray-600">End: {formatDate(booking.end_date)}</p>
                        {booking.special_requests && (
                          <p className="text-sm text-gray-600">Requests: {booking.special_requests}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <div className="flex gap-1">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                            >
                              <FaCheck className="text-xs" />
                              Confirm
                            </button>
                          )}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 flex items-center gap-1"
                            >
                              <FaTrash className="text-xs" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
                )}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookings</p>
                )}
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Payments</h3>
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{payment.property_title || `Property #${payment.property_id}`}</p>
                        <p className="text-sm text-gray-600">Tenant: {payment.user_first_name} {payment.user_last_name}</p>
                        <p className="text-sm text-gray-600">Amount: KES {parseFloat(payment.amount)?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Due: {formatDate(payment.due_date)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => {
                              const validBooking = bookings.find(b => 
                                b.property_id === payment.property_id && 
                                b.status === 'confirmed'
                              );
                              if (validBooking) {
                                handleConfirmPayment(payment.id);
                              } else {
                                alert('Cannot confirm payment - no valid booking found for this property.');
                              }
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center gap-1 min-w-[80px]"
                          >
                            <FaCheck className="text-xs" />
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                )}
                {payments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No payments</p>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                ))}
                {notifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No notifications</p>
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
                          <span>{issue.property_title || `Property #${issue.property_id}`}</span>
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