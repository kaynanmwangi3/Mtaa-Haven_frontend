import { useState } from 'react';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaTimes, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import api from '../services/auth';
import { authService } from '../services/auth';


const PropertyModal = ({ property, isOpen, onClose}) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    tenant_id: '',
    property_id: '',
    start_date: '',
    end_date: '',
    special_requests: ''
  });
  const [paymentData, setPaymentData] = useState({
    payment_method: 'mpesa',
    phone_number: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [hasUnpaidBooking, setHasUnpaidBooking] = useState(false);

  if (!isOpen || !property) return null;

  const cld = new Cloudinary({ cloud: { cloudName: 'djtahjahe' } });

  // Check if a booking has been paid
  const checkBookingPaymentStatus = async (bookingId) => {
    try {
      const user = authService.getCurrentUser();
      const paymentsRes = await api.get(`/payments?user_id=${user.id}&user_type=tenant`);
      const payments = paymentsRes.data.payments || [];
      
      // Check if there's a payment for this booking's property
      const hasPayment = payments.some(payment => 
        payment.property_id === property.id && 
        payment.status === 'COMPLETED'
      );
      
      setHasUnpaidBooking(!hasPayment);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setHasUnpaidBooking(true); // Default to showing payment if check fails
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = authService.getCurrentUser(); 
      const tenantId = user?.id; 
      if (!tenantId) {
        alert('You must be logged in as a tenant to make a booking.');
        setLoading(false);
        return;
      }

      // Validate dates
      if (!bookingData.start_date || !bookingData.end_date) {
        alert('Please select both start and end dates.');
        setLoading(false);
        return;
      }

      if (new Date(bookingData.start_date) >= new Date(bookingData.end_date)) {
        alert('End date must be after start date.');
        setLoading(false);
        return;
      }

      // Convert dates to the required format: "2024-01-15T14:30:25.123456"
      const formatDateTime = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toISOString().replace('Z', '').replace(/\d{3}$/, '123456');
      };

      const bookingPayload = {
        tenant_id: tenantId,
        property_id: property.id,
        start_date: formatDateTime(bookingData.start_date),
        end_date: formatDateTime(bookingData.end_date),
        special_requests: bookingData.special_requests || ''
      };

      const response = await api.post('/bookings', bookingPayload);
      const newBooking = response.data.booking;
      setCreatedBooking(newBooking);
      
      try {
        const propertyRes = await api.get(`/properties/${property.id}`);
        const propertyData = propertyRes.data.property;
        
        if (propertyData && propertyData.landlord_id) {
          await api.post('/notifications', {
            title: 'New Booking Request',
            message: `New booking request for ${property.title} from ${user?.first_name} ${user?.last_name}`,
            user_id: propertyData.landlord_id,
            property_id: property.id,
            type: 'general'
          });
        }
      } catch (notifError) {
        console.error('Failed to send notification to landlord:', notifError);
      }
      
      alert('Booking request submitted successfully! Wait for landlord confirmation before making payment.');
      setShowBookingForm(false);
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error response:', error.response?.data);

      
      let errorMessage = 'Failed to submit booking';
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || error.response?.data?.message || 'Invalid booking data';
      } else if (error.response?.status === 404) {
        errorMessage = 'Property not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(`Booking failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        alert('You must be logged in to make a payment.');
        setLoading(false);
        return;
      }

      // Create due date (30 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      // Only create payment if we have a booking and it's unpaid
      if (!createdBooking) {
        alert('No booking found. Please create a booking first.');
        setLoading(false);
        return;
      }

      const paymentPayload = {
        user_id: user.id,
        property_id: createdBooking.property_id,
        amount: property.rent_amount,
        due_date: dueDate.toISOString().replace('Z', '').replace(/\d{3}$/, '123456'),
        payment_method: paymentData.payment_method,
        notes: paymentData.notes || `Payment for booking #${createdBooking.id}`
      };

      const response = await api.post('/payments', paymentPayload);
      alert('Payment processed successfully!');
      setShowPaymentForm(false);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Payment failed';
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="property-modal-title">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" role="document">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 id="property-modal-title" className="text-2xl font-bold text-gray-800">{property.title}</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close property details"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-full">
              <img
                src={property.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            
          </div>

          {/* Property Details */}
          <div className="lg:w-1/2 p-6">
            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-green-600">
                KES {property.rent_amount?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-gray-600">per month</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaBed className="text-gray-600" />
                <span>{property.bedrooms || 0} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-gray-600" />
                <span>{property.bathrooms || 0} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="text-gray-600" />
                <span>{property.area_sqft || 'N/A'} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-600" />
                <span>{ property.address || 'Location not specified'},{property.city || 'Location not specified'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description ||
                  'This beautiful property offers modern amenities and comfortable living spaces. Perfect for individuals or families looking for a quality rental in a prime location.'}
              </p>
            </div>

            {/* Contact Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your message..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCalendarAlt />
                    Book Property
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Book Property</h3>
            <form onSubmit={handleBooking}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={bookingData.start_date}
                    onChange={(e) => setBookingData({...bookingData, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={bookingData.end_date}
                    onChange={(e) => setBookingData({...bookingData, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests</label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData({...bookingData, special_requests: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    placeholder="Any special requirements..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Property: {property.title}</p>
              <p className="text-sm text-gray-600">Booking ID: #{createdBooking?.id}</p>
              <p className="text-lg font-bold text-green-600">KES {property.rent_amount?.toLocaleString()}</p>
            </div>
            <form onSubmit={handlePayment}>
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
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyModal;