import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function MiddlePart(){
    return(
        <div>
            <div>
          <div
            id="carouselExampleCaptions"
            class="carousel slide"
            data-bs-ride="false"
          >
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img
                  src="https://media.istockphoto.com/id/2155879397/photo/house-in-a-charming-neighborhood-with-stunning-sidewalk-landscaping.jpg?s=612x612&w=0&k=20&c=nQJOUoNb2RNev3QVNjIohcmxQABCTetCdgfnc8MV8sU="
                  class="d-block w-100 h-170 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block text-white">
                  <h5 class='text-white'>HOUSES</h5>
                  <p>
                    Locate your ideal apartment in the perfect neighborhood.
                  </p>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  src="https://i.pinimg.com/originals/29/61/07/2961072ce9c7fa492d20a8ee007c4847.jpg"
                  class="d-block w-100  h-170 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>HOSTELS</h5>
                  <p>
                    Discover comfortable and affordable hostel stays.
                  </p>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  src="https://media.istockphoto.com/id/1437629749/photo/land-plot-in-aerial-view-in-chiang-mai-of-thailand.jpg?s=612x612&w=0&k=20&c=07y-L9_WJwFGmvvhrZULYbfTfDtUPHnxJhbxWPTiqYg="
                  class="d-block w-100  h-170 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5 class='text-white'>LAND</h5>
                  <p>
                    Find the perfect plot of land to build your future.
                  </p>
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        </div>
    )
}
export default MiddlePart