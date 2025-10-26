import "../App.css";
import "./Home.css";
import { Link } from 'react-router-dom'


function About() {

  return (
    <div>
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 p-6">
        <div class="flex-1">
          <img
            src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ec615d8968cc16e21c_pexels-michael-block-1691617-3225531-p-1600.jpg"
            alt=""
            class="w-full h-150 object-cover rounded-lg shadow-md"
          />
        </div>

        <div class="flex-1 text-center md:text-left text-white">
          <h2 class="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
            <i class="bx bx-right-arrow-alt text-3xl"></i> About
          </h2>
          <h4 class="text-sm leading-relaxed">
            Welcome to Mtaa Haven, your trusted online gateway to finding and
            listing rental properties within your local community. Designed to
            simplify the housing search, our platform connects residents
            directly with neighbors, offering a curated, user-friendly
            experience that turns your search for the perfect home into a
            journey back to the neighborhood.
            <br />
            <br />
            <i class="bx bxs-star text-yellow-400"></i> We simplify the search
            for your perfect local home.
            <br />
            <i class="bx bxs-star text-yellow-400"></i> We connect you directly
            with trusted community listings.
            <br />
            <i class="bx bxs-star text-yellow-400"></i> We are committed to a
            transparent and user-friendly experience.
            <br />
            <i class="bx bxs-star text-yellow-400"></i> We are your trusted
            partner in finding a place to belong.
          </h4>
        </div>

        <div class="flex-1 mt-15 ">
          <img
            src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ebec31ca9013fd05fe_pexels-habi-dompil-1539296-2964163-p-1600.jpg"
            alt=""
            class="w-full h-90 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button class="px-8 py-3 border border-white  font-semibold cta-btn"  >
           <Link to='/login' class='link-tag'>JOIN US</Link>
        </button>
      </div>
      <div class="flex flex-col  items-center justify-center mt-3">
        <div>
          <h4 class="flex items-center text-white">
            <i class="bx bx-right-arrow-alt text-3xl"></i>MTAA HAVEN AT A GLANCE{" "}
            <i class="bx bx-left-arrow-alt text-3xl"></i>
          </h4>
        </div>
        <div class="mt-2">
          <h2 class="text-white">
            DELIVERING EXCELLENCE,
            <br /> ONE STAY AT A TIME
          </h2>
        </div>
        <div class="flex  gap-5 mt-4 mb-2">
          <div class="flex gap-1 items-center">
            <p class="text-white text-5xl">10</p>
            <small class="text-white">
              YEARS OF
              <br /> EXPERIENCE
            </small>
          </div>
          <div class="flex gap-1 items-center">
            <p class="text-white text-5xl">87</p>
            <small class="text-white">
              LUXURY
              <br /> ROOMS
            </small>
          </div>
          <div class="flex gap-1 items-center">
            <p class="text-white text-5xl">90%</p>
            <small class="text-white">
              SATISFACTION
              <br /> RATE
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;


