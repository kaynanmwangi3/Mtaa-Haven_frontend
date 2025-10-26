import '../App.css'
import {useState,useEffect} from 'react';
import { FaBed, FaBath, FaHeart, FaSort } from 'react-icons/fa';
import './Properties.css';
import PropertyModal from '../components/PropertyModal';
import SearchFilters from '../components/SearchFilters';
import api from '../services/auth';

function Properties(){
     const [properties, setProperties] = useState([])
     const [filteredProperties, setFilteredProperties] = useState([])
     const [selectedProperty, setSelectedProperty] = useState(null);
     const [favorites, setFavorites] = useState(new Set());
     const [sortBy, setSortBy] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [currentFilters, setCurrentFilters] = useState({});

     useEffect(()=>{
         fetchProperties();
     },[])

     useEffect(() => {
         applyFiltersAndSort();
     }, [properties, currentFilters, sortBy, sortOrder]);

     const fetchProperties = async () => {
         try {
             const response = await api.get('/properties');
             setProperties(response.data.properties || []);
         } catch (error) {
             console.error('Error fetching properties:', error);
             // Fallback to direct fetch if api fails
             try {
                 const response = await fetch('http://localhost:5000/api/properties');
                 const data = await response.json();
                 setProperties(data.properties || []);
             } catch (fallbackError) {
                 console.error('Fallback fetch also failed, using demo data:', fallbackError);
                 // Demo properties for when backend is unavailable
                 setProperties([
                     {
                         id: 1,
                         name: "Modern 2BR Apartment",
                         rent_amount: 25000,
                         bedrooms: 2,
                         bathrooms: 1,
                         location: "Westlands, Nairobi",
                         image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800",
                         description: "Beautiful modern apartment with great amenities and city views.",
                         amenities: ["Parking", "Security", "Gym", "Swimming Pool"]
                     },
                     {
                         id: 2,
                         name: "Cozy Studio Unit",
                         rent_amount: 15000,
                         bedrooms: 1,
                         bathrooms: 1,
                         location: "Kilimani, Nairobi",
                         image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800",
                         description: "Perfect starter home with all essential amenities.",
                         amenities: ["Security", "Water", "Electricity", "WiFi"]
                     },
                     {
                         id: 3,
                         name: "Spacious 3BR House",
                         rent_amount: 45000,
                         bedrooms: 3,
                         bathrooms: 2,
                         location: "Karen, Nairobi",
                         image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800",
                         description: "Luxurious family home with garden and modern finishes.",
                         amenities: ["Garden", "Parking", "Security", "Maid's Quarter"]
                     }
                 ]);
             }
         }
     };

     const handleViewDetails = (property) => {
         setSelectedProperty(property);
     };

     const handleFavorite = (propertyId, isFavorited) => {
         setFavorites(prev => {
             const newFavorites = new Set(prev);
             if (isFavorited) {
                 newFavorites.add(propertyId);
             } else {
                 newFavorites.delete(propertyId);
             }
             return newFavorites;
         });
     };

     const handleCloseModal = () => {
         setSelectedProperty(null);
     };

     const handleSearch = (query, filters) => {
         setCurrentFilters({ ...filters, searchQuery: query });
     };

     const handleFilterChange = (filters) => {
         setCurrentFilters(filters);
     };

     const applyFiltersAndSort = () => {
         let filtered = [...properties];

         // Apply search query
         if (currentFilters.searchQuery) {
             const query = currentFilters.searchQuery.toLowerCase();
             filtered = filtered.filter(property =>
                 property.name.toLowerCase().includes(query) ||
                 property.location.toLowerCase().includes(query) ||
                 property.description?.toLowerCase().includes(query) ||
                 property.amenities?.some(amenity => amenity.toLowerCase().includes(query))
             );
         }

         // Apply price filters
         if (currentFilters.minPrice) {
             filtered = filtered.filter(property => property.rent_amount >= parseInt(currentFilters.minPrice));
         }
         if (currentFilters.maxPrice) {
             filtered = filtered.filter(property => property.rent_amount <= parseInt(currentFilters.maxPrice));
         }

         // Apply bedroom filter
         if (currentFilters.bedrooms) {
             filtered = filtered.filter(property => property.bedrooms >= parseInt(currentFilters.bedrooms));
         }

         // Apply location filter
         if (currentFilters.location) {
             filtered = filtered.filter(property => property.location === currentFilters.location);
         }

         // Apply property type filter
         if (currentFilters.propertyType) {
             filtered = filtered.filter(property => property.type === currentFilters.propertyType);
         }

         // Apply amenities filter
         if (currentFilters.amenities && currentFilters.amenities.length > 0) {
             filtered = filtered.filter(property =>
                 currentFilters.amenities.every(amenity =>
                     property.amenities?.includes(amenity)
                 )
             );
         }

         // Apply sorting
         filtered.sort((a, b) => {
             let aValue, bValue;

             switch (sortBy) {
                 case 'price':
                     aValue = a.rent_amount;
                     bValue = b.rent_amount;
                     break;
                 case 'bedrooms':
                     aValue = a.bedrooms;
                     bValue = b.bedrooms;
                     break;
                 case 'name':
                 default:
                     aValue = a.name.toLowerCase();
                     bValue = b.name.toLowerCase();
                     break;
             }

             if (sortOrder === 'asc') {
                 return aValue > bValue ? 1 : -1;
             } else {
                 return aValue < bValue ? 1 : -1;
             }
         });

         setFilteredProperties(filtered);
     };

     const toggleSort = (field) => {
         if (sortBy === field) {
             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
         } else {
             setSortBy(field);
             setSortOrder('asc');
         }
     };

     return(
         <div className="px-8 py-12 bg-black">
             <div className="mb-8">
                 <h1 className="text-4xl font-bold text-white mb-4">Available Properties</h1>
                 <p className="text-gray-300 text-lg">Find your perfect rental property in the community</p>
             </div>

             {/* Search and Filters */}
             <SearchFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

             {/* Sort Controls */}
             <div className="flex justify-between items-center mb-6">
                 <p className="text-white">
                     Showing {filteredProperties.length} of {properties.length} properties
                 </p>
                 <div className="flex gap-4">
                     <select
                         value={`${sortBy}-${sortOrder}`}
                         onChange={(e) => {
                             const [field, order] = e.target.value.split('-');
                             setSortBy(field);
                             setSortOrder(order);
                         }}
                         className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                         <option value="name-asc">Name (A-Z)</option>
                         <option value="name-desc">Name (Z-A)</option>
                         <option value="price-asc">Price (Low to High)</option>
                         <option value="price-desc">Price (High to Low)</option>
                         <option value="bedrooms-asc">Bedrooms (Low to High)</option>
                         <option value="bedrooms-desc">Bedrooms (High to Low)</option>
                     </select>
                 </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredProperties.map((property) => (
                 <div
                   key={property.id}
                   className="relative bg-black h-150 overflow-hidden shadow-lg group transition-transform transform hover:scale-105"
                 >
                   {/* Property Image */}
                   <img
                     src={property.image || "https://media.istockphoto.com/id/2204430566/photo/atlanta-georgia-house-usa.jpg?s=612x612&w=0&k=20&c=wQjugaIwMWyAu3YbT-85bGa6-G9mkNIv8aKRieMcgJc="}
                     alt={property.name}
                     className="w-full h-150 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                   />

                   {/* Favorite button */}
                   <button
                     onClick={() => handleFavorite(property.id, !favorites.has(property.id))}
                     className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                       favorites.has(property.id) ? 'text-red-500 bg-white' : 'text-white bg-black bg-opacity-50'
                     }`}
                   >
                     <FaHeart className={`text-xl ${favorites.has(property.id) ? 'fill-current' : ''}`} />
                   </button>

                   {/* Overlay gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                   {/* Text content */}
                   <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                     <h3 className="text-xl font-semibold mb-2 uppercase tracking-wide">
                       {property.name}
                     </h3>
                     <p className="text-lg font-light mb-4">
                       KES {property.rent_amount?.toLocaleString() || 'N/A'} / MONTH
                     </p>

                     <button
                       onClick={() => handleViewDetails(property)}
                       className="border border-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition-all mr-3"
                     >
                       VIEW DETAILS
                     </button>

                     {/* Icons row */}
                     <div className="flex items-center gap-6 mt-5 text-sm">
                       <div className="flex items-center gap-2">
                         <FaBed />
                         <span>{property.bedrooms || 0} Bedrooms</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <FaBath />
                         <span>{property.bathrooms || 0} Bathrooms</span>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

             {/* Property Modal */}
             <PropertyModal
               property={selectedProperty}
               isOpen={!!selectedProperty}
               onClose={handleCloseModal}
               onFavorite={handleFavorite}
             />
         </div>
     )
 }
 export default Properties;