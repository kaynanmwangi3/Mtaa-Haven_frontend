import React from "react";
import "../App.css"; // external CSS for the animation

export default function Gallery() {
  // Add as many images as you want here
  const images = [
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2",
    "https://picsum.photos/300/200?random=3",
    "https://picsum.photos/300/200?random=4",
    "https://picsum.photos/300/200?random=5",
    "https://picsum.photos/300/200?random=6",
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
