import { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const SearchFilters = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    city: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const cities = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Malindi","Machakos","Naivasha"];

  const types = ["Apartment", "House", "Studio", "Townhouse", "Villa", "Bungalow"];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      city: "",
      type: "",
      amenities: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== ""
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      role="search"
      aria-label="Property search and filters"
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <label htmlFor="property-search" className="sr-only">
            Search properties
          </label>
          <input
            id="property-search"
            type="text"
            placeholder="Search properties, locations, or amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="search-help"
          />
          <FaSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <span id="search-help" className="sr-only">
            Search by property name, location, or amenities
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-lg transition-colors flex items-center gap-2 ${
            showFilters
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FaFilter />
          Filters
          {hasActiveFilters() && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
              {Object.values(filters).reduce(
                (count, value) =>
                  count + (Array.isArray(value) ? value.length : value ? 1 : 0),
                0
              )}
            </span>
          )}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (KES)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  handleFilterChange("type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <FaTimes />
              Clear All Filters
            </button>
            <div className="text-sm text-gray-600">
              {hasActiveFilters() ? "Filters applied" : "No filters applied"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
