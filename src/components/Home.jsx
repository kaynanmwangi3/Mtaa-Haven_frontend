import "../App.css";
import "boxicons/css/boxicons.min.css";
import "./Home.css";
import MiddlePart from './MiddlePart'

function Home() {
  return (
    <div>
      <div class="yoh">
        <div class="flex items-center justify-between p-1 cld">
          <div class="flex gap-3">
            <button className="text-white">
              <i className="bx bxl-facebook"></i>
              <p>Facebook</p>
            </button>
            <button className="text-white">
              <i className="bx bxl-twitter"></i>
              <p>Twitter</p>
            </button>
            <button className="text-white">
              <i className="bx bxl-instagram"></i>
              <p>Instagram</p>
            </button>
            <button className="text-white">
              <i className="bx bxl-linkedin"></i>
              <p>LinkedIn</p>
            </button>
          </div>
          <div>
            <h5 class="text-white  ">123 Maple Street, Springfield, IL 62704</h5>
          </div>
        </div>
      </div>
      <div class="bg-black">
        <div>
          <nav class="flex justify-between pb-1 items-center">
            <div class="flex gap-3 pl-5 items-center">
              <p class="text-white text-2xl">Home</p>
              <p class="text-white text-2xl">About</p>
              <p class="text-white text-2xl">Properties</p>
            </div>
            <div>
              <h1 class="text-white">Mtaa Haven</h1>
            </div>
            <div class="flex gap-3 pr-5 ">
              <button class="text-white">
                <i className="bx bx-search text-3xl"></i>
              </button>
              <button class="text-white">
                <i className="bx bx-log-out text-3xl"></i>
              </button>
            </div>
          </nav>
        </div>
      </div>
      <MiddlePart/>
    </div>
  );
}
export default Home;
