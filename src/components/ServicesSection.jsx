import { useState } from "react";
import "./ServicesSection.css";

const initialBg =
  "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_2778/x_0,y_417,w_5000,h_1944,c_crop,q_80,fl_progressive/w_900,h_506,f_auto,c_fit/the-bristol-hotel-gurgaon/4_Swimming_Pool_CC2FCF_SH_l1si3f";

const services = [
  {
    id: "apartment",
    label: "Apartments",
    bg: "https://crm.roongtadevelopers.com/app/admin/assets/images/blog/1723200045.jpg",
    description: "Enjoy your stay in our exclusive apartments.",
  },
  {
    id: "hostel",
    label: "Hostels",
    bg: "https://budgettraveller.org/wp-content/uploads/2015/08/IMG_5250.jpg",
    description: "Students enjoy their stay in our safe and secure hostels.",
  },
  {
    id: "mansions",
    label: "Mansions & Manors",
    bg: "https://media.istockphoto.com/id/157337394/photo/english-country-mansion.jpg?s=612x612&w=0&k=20&c=VqJNTINsCYliuVJnBqaZrfT5ygeeUqf-z4_zhL1hJw0=",
    description: "Enrich your taste in timeless elegance.",
  },
  {
    id: "villa",
    label: "Villa",
    bg: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fa9875c79-7050-462d-a8cb-f8fa42b4ba9a.jpg?crop=1920%2C1261%2C0%2C0",
    description: "Enjoy exquisite dining experiences curated by top chefs.",
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState(null);

  return (
    <section className="relative h-200 w-full overflow-hidden flex ">
      {/* ---------------- BACKGROUNDS ---------------- */}
      <div className="absolute inset-0 transition-opacity duration-700">
        {/* Initial background */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            active ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${initialBg})` }}
        />

        {/* Service-specific backgrounds */}
        {services.map((s) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              active?.id === s.id ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white text-center px-6">
        {/* Main Title */}
        <h1 className="mb-12 text-5xl md:text-7xl font-semibold tracking-wider animate-in fade-in flex items-center justify-center">
          {active?.label?.toUpperCase() ?? "PROPERTIES"}
        </h1>

        {/* SERVICE BUTTONS */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-xl md:text-2xl font-light uppercase">
          {services.map((s) => (
            <div
              key={s.id}
              onMouseEnter={() => setActive(s)}
              onMouseLeave={() => setActive(null)}
              className="group cursor-pointer flex flex-col items-center transition-all duration-500"
            >
              <span
                className={`relative pb-1 transition-colors duration-300 ${
                  active?.id === s.id ? "text-white" : "text-white/70"
                } group-hover:text-white`}
              >
                {s.label}
                {/* underline animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                    active?.id === s.id ? "w-full" : "w-0"
                  } group-hover:w-full`}
                ></span>
              </span>

              {/* Description (appears on hover) */}
              <p
                className={`mt-2 max-w-xs text-sm md:text-base text-white/80 transition-all duration-500 ease-in-out ${
                  active?.id === s.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                }`}
              >
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
