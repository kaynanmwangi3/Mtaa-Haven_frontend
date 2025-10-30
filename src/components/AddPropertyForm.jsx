import { useState } from "react";
import api from "../services/auth"; // uses your configured axios instance
import { authService } from "../services/auth";

const AddPropertyForm = ({ onSuccess }) => {
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    title: "",
    rent_amount: "",
    city: "",
    description: "",
    address: "",
    area_sqft: "",
    url: "",
    bedrooms: 1,
    bathrooms: 1,
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.user_type !== "landlord") {
      setMessage("❌ Only landlords can add properties.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/properties", {
        ...formData,
        landlord_id: user.id,
      });

      setMessage("✅ Property created successfully!");
      setFormData({
        title: "",
        rent_amount: "",
        city: "",
        description: "",
        area_sqft: "",
        address: "",
        url: "",
        bedrooms: 1,
        bathrooms: 1,
        type: "",
      })
      console.log("Property added:", response.data);

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Add Property</h2>

      {message && (
        <div
          className={`p-2 mb-3 text-sm rounded ${
            message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="rent_amount"
          placeholder="Rent Amount"
          value={formData.rent_amount}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="url"
          placeholder="Image URL"
          value={formData.url}
          onChange={handleChange}
          className="border p-2 rounded"
        />
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="border p-2 rounded "
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="border p-2 rounded "
          />
        <input
            type="number"
            name="area_sqft"
            placeholder="Area (sqft)"
            value={formData.area_sqft}
            onChange={handleChange}
            className="border p-2 rounded "
          />
        <input
          type="text"
          name="type"
          placeholder="Property Type (Apartment, Villa, etc.)"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
