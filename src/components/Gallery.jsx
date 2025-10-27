import React from "react";
import "../App.css"; 

export default function Gallery() {
  
  const images = [
    "https://cdn.mos.cms.futurecdn.net/zisziefsfzb4YXpdixfhFA.jpg",
    "https://niche.scene7.com/is/image/NicheDesign/25Mercer-4-1B-1?$Blog%20Image$",
    "https://img.freepik.com/free-photo/house-forest-covered-greenery-sunlight-daytime_181624-9634.jpg?semt=ais_hybrid&w=740&q=80",
    "https://media.istockphoto.com/id/1437629749/photo/land-plot-in-aerial-view-in-chiang-mai-of-thailand.jpg?s=612x612&w=0&k=20&c=07y-L9_WJwFGmvvhrZULYbfTfDtUPHnxJhbxWPTiqYg=",
    "https://hips.hearstapps.com/hmg-prod/images/west-virginia-gray-cottage-64dd6bb056057.jpg?crop=0.943xw:0.817xh;0.0224xw,0.0932xh",
    "https://media.istockphoto.com/id/454339695/photo/new-constructed-home-for-sale.jpg?s=612x612&w=0&k=20&c=-X5SNl-M9GfSb1fJSs62BwLd5DqxVnFbijJISIUgfY8=",
  ];

  return (
    <section className="scroll-section bg-[#0e0e0e] py-12 overflow-hidden">
      <h2 className="text-center text-white text-3xl font-semibold mb-10">
        Our Gallery
      </h2>

      {/* Scrolling container */}
      <div className="scroll-container relative w-full overflow-hidden">
        {/* Duplicate image sets for seamless looping */}
        <div className="scroll-track flex animate-scroll-x">
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="mx-4 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-gray-700"
            >
              <img
                src={img}
                alt={`scroll-img-${index}`}
                className="w-[300px] h-[200px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
