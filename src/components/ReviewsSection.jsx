import React from "react";
import "../App.css"; // external CSS file for extra styling

const reviews = [
  {
    name: "Kevin Clint",
    role: "Customer",
    img: "https://i.pravatar.cc/80?img=1",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
  {
    name: "David Mark",
    role: "Customer",
    img: "https://i.pravatar.cc/80?img=2",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
  {
    name: "T. Steaphny",
    role: "Customer",
    img: "https://i.pravatar.cc/80?img=3",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
];

export default function ReviewsSection() {
  return (
    <section className="reviews-section py-16 px-8 bg-[#0f0f0f] text-white">
      <h2 className="text-center text-3xl font-semibold mb-2">
        REVIEWS
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {reviews.map((r, index) => (
          <div
            key={index}
            className="review-card bg-[#1b1b1b] p-6 rounded-2xl shadow-lg w-[350px] border border-gray-700 hover:scale-[1.02] transition-all"
          >
            <div className="text-4xl text-gray-400 mb-4">“</div>
            <p className="text-gray-300 mb-6">{r.review}</p>

            <div className="flex items-center mt-4">
              <img
                src={r.img}
                alt={r.name}
                className="w-12 h-12 rounded-full border-2 border-gray-500"
              />
              <div className="ml-4">
                <h4 className="text-lg font-bold">{r.name.toUpperCase()}</h4>
                <p className="text-sm text-gray-400">{r.role}</p>
              </div>
            </div>

            <div className="mt-4 flex text-yellow-400">
              {Array.from({ length: r.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
