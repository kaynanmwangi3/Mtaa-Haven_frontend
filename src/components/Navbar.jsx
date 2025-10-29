import "../App.css";
import "./Home.css";

function Navbar() {
  return (
    <div>
      <div class="yoh ">
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
            <h5 class="text-white  ">
              123 Maple Street, Springfield, IL 62704
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
