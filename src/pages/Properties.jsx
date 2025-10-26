import '../App.css'
import {useState,useEffect} from 'react';
import { FaBed, FaBath, FaHeart } from 'react-icons/fa';
import './Properties.css';
import PropertyModal from '../components/PropertyModal';
import api from '../services/auth';

function Properties(){
     const [properties, setProperties] = useState([])
     const [selectedProperty, setSelectedProperty] = useState(null);
     const [favorites, setFavorites] = useState(new Set());

     useEffect(()=>{
         fetchProperties();
     },[])

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
                 console.error('Fallback fetch also failed:', fallbackError);
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

     return(
         <div className="px-8 py-12 bg-black">
             <div className="mb-8">
                 <h1 className="text-4xl font-bold text-white mb-4">Available Properties</h1>
                 <p className="text-gray-300 text-lg">Find your perfect rental property in the community</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {properties.map((property) => (
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