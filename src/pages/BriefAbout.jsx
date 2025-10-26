import "../App.css";
import "./BriefAbout.css";
import { useNavigate } from "react-router-dom";

function BriefAbout() {
  const navigate = useNavigate();
  return (
    <div>
      <div class="about-sec">
        <p class="text-5xl flex justify-center ">
          A MTAA HAVEN EXPERIENCE LIKE NO OTHER
        </p>
      </div>
      <div class="flex justify-center gap-4 mt-10 mb-10">
        <div class="">
          <img
            src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ea48e5d79979e3b042_pexels-rpnickson-2417842-p-2000.jpg"
            alt=""
            class="h-180"
          />
        </div>
        <div class="w-180 middle-exp mr-4">
          <div class="border-for-middle">
            <p class="text-2xl"> ABOUT MTAA HAVEN</p>
            <br />
            <p class="text-3xl">
              WHERE COMFORT <br />
              MEETS AFFORDABILTY
            </p>
          </div>
        </div>
        <div>
          <img
            src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ec615d8968cc16e21c_pexels-michael-block-1691617-3225531-p-2000.jpg"
            alt=""
            class="h-180"
          />
        </div>
      </div>
      <div class="flex justify-around gap-14 ">
        <div class="ml-4">
          <div class="text-white">
            <p>
              <i class="bx bx-right-arrow-alt text-2xl"></i>MTAA HAVEN
            </p>
            <p class="text-5xl">
              WHERE EVERY STAY <br />
              FEELS SPECIAL
            </p>
            <p>
              Welcome to Mtaa Haven, your trusted online gateway to finding and
              listing
              <br /> rental properties within your local community. Designed to
              simplify
              <br /> the housing search, our platform connects residents
              directly with neighbors,
              <br /> offering a curated, user-friendly experience that turns
              your search for the perfect
              <br /> home into a journey back to the neighborhood.
            </p>
            <button
              class="view-prop-btn mb-5"
              onClick={() => navigate("/properties")}
            >
              VIEW PROPERTIES
            </button>
            <img
              src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/684da7b00f1c84f5fbd915cd_pexels-leorossatti-2598638-p-2000.jpg"
              alt=""
              class="w-140 h-120"
            />
          </div>
        </div>
        <div>
          <img
            src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/684da7b09b96d431d2fa153d_roberto-nickson-emqnSQwQQDo-unsplash-p-2000.jpg"
            alt=""
            class="w-250 h-200"
          />
        </div>
      </div>
      <div class="mt-5">
        <div>
          <div class="flex text-white">
            <i class="bx bx-right-arrow-alt text-2xl"></i>
            <p class="">WHY CHOOSE US</p>
          </div>
          <p class="text-5xl text-white">WHY CHOOSE US</p>
        </div>
        <div class="flex justify-around gap-3 mt-5 mb-10">
          <div class="card">
            <img
              src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ebec31ca9013fd05fe_pexels-habi-dompil-1539296-2964163-p-1080.jpg"
              alt="Beachfront Location"
              class="card-image"
            />
            <div class="card-content">
              <h2>PRIME BEACHFRONT LOCATION</h2>
              <p>
                Wake up to the sound of waves and enjoy breathtaking sea views
                every day.
              </p>
            </div>
          </div>
          <div class="card">
            <img
              src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ef82a78a705b5230a9_pexels-pixabay-53464-p-1080.jpg"
              alt="Beachfront Location"
              class="card-image"
            />
            <div class="card-content">
              <h2>LUXURY MEETS COMFORT</h2>
              <p>
                Elegantly designed rooms and suites with modern amenities and
                cozy vibes.
              </p>
            </div>
          </div>
          <div class="card">
            <img
              src="https://cdn.prod.website-files.com/684c437bd1bedfba51264f48/685457ebf904323d08b524cf_febrian-zakaria-gwV9eklemSg-unsplash-p-1080.jpg"
              alt="Beachfront Location"
              class="card-image"
            />
            <div class="card-content">
              <h2>ALL-IN-ONE EXPERIENCE</h2>
              <p>
                Spa, fine dining, pool, and excursions — all within the resort
                for a seamless stay.
              </p>
            </div>
          </div>
        </div>
        <div class="team-container">
          <div class="team-header">
            <h1>MEET OUR TEAM</h1>
          </div>
          <div class="team-cards">
            <div class="team-card">
              <img
                src="https://st.depositphotos.com/2101611/3925/v/450/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
                alt="Sarah Leah"
                class="team-image"
              />
              <div class="team-name">Elnabas Eugine</div>
            </div>
            <div class="team-card">
              <img
                src="https://media.istockphoto.com/id/1273297923/vector/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-woman-avatar-profile.jpg?s=612x612&w=0&k=20&c=L6H2sqg64M11I7xqwJiMV5rZfaxzt9U0a9kfAX1xh7A="
                alt="Emily Davis"
                class="team-image"
              />
              <div class="team-name">Irene Muema</div>
            </div>
            <div class="team-card">
              <img
                src="https://st.depositphotos.com/2101611/3925/v/450/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
                alt="Mark Johnson"
                class="team-image"
              />
              <div class="team-name">John Atieli</div>
            </div>
            <div class="team-card">
              <img
                src="https://st.depositphotos.com/2101611/3925/v/450/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
                alt="Emily Davis"
                class="team-image"
              />
              <div class="team-name">Kaynan Mwangi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BriefAbout;
