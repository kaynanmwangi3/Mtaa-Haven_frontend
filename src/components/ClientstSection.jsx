import React from "react";
import "../App.css"; // external CSS for animation

export default function ClientsSection() {
  const clients = ["WAND", "RONDA", "TATE®", "BRONX", "Nexoy", "WAND", "RONDA", "TATE®", "BRONX", "Nexoy"];

  return (
    <section className="clients-section bg-[#121212] text-white py-12 overflow-hidden">
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-gray-500 flex-grow mx-4"></div>
        <span className="text-sm tracking-widest text-gray-300 uppercase">
          Clients I’ve Worked With
        </span>
        <div className="border-t border-gray-500 flex-grow mx-4"></div>
      </div>

      <div className="overflow-hidden w-full">
        <div className="clients-scroll flex whitespace-nowrap animate-scroll">
          {clients.map((client, index) => (
            <span
              key={index}
              className="mx-10 text-3xl font-semibold tracking-wider opacity-90 hover:opacity-100 transition"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
