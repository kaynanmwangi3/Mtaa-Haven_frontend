import "../App.css";
import "./Home.css";
import "../App.css";
import "./Home.css";

function Navbar() {

  return (
    <div>
      <div className="yoh ">
        <div className="flex items-center justify-between p-1 cld">
          <div className="flex gap-3">
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
            <h5 className="text-white">
              123 Maple Street, Springfield, IL 62704
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
