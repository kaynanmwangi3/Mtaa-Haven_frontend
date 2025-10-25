import '../App.css'
import {useState,useEffect} from 'react';
import { FaBed, FaBath } from 'react-icons/fa';
import './Properties.css';

function Properties(){
    const [properties, setProperties] = useState([])

    useEffect(()=>{
        fetch('http://localhost:5000/api/properties')
        .then(response => response.json())
        .then(data => setProperties(data.properties))
        .catch(error => console.error('Error fetching properties:', error));
    },[])
    console.log(properties);
    

    return(
        <div className="px-8 py-12 bg-black">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {properties.map((property) => (
          <div
            key={property.id}
            className="relative bg-black h-150 overflow-hidden shadow-lg group transition-transform transform hover:scale-105"
          >
            {/* Property Image */}
            <img
              src="https://media.istockphoto.com/id/2204430566/photo/atlanta-georgia-house-usa.jpg?s=612x612&w=0&k=20&c=wQjugaIwMWyAu3YbT-85bGa6-G9mkNIv8aKRieMcgJc="
              alt={property.name}
              className="w-full h-150 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Text content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="text-xl font-semibold mb-2 uppercase tracking-wide">
                {property.name}
              </h3>
              <p className="text-lg font-light mb-4">
                KES {property.rent_amount} / MONTH
              </p>

              <button className="border border-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition-all">
                VIEW DETAILS
              </button>

              {/* Icons row */}
              <div className="flex items-center gap-6 mt-5 text-sm">
                <div className="flex items-center gap-2">
                  <FaBed />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBath />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}
export default Properties;