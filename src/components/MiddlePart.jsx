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
                  src="https://lh4.googleusercontent.com/OljzWa2o_v9hzbU4ssWVn3DdOcaTx_cKecch2IG6xuByffH6RqFNcL2qDzXMnqFT5S-M_CAnyigz6bh66phNQjlrevcts79jVepTyoK5BZohUfGFo3abaryV3PbFvVijV6GdZnVN8eAQZzsA7GTUfhE"
                  class="d-block w-100 h-140 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block text-white">
                  <h5 class='text-white'>Houses</h5>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit dicta temporibus eaque vero, eveniet nesciunt tempora quae rem laboriosam accusantium!
                  </p>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  src="https://i.pinimg.com/originals/29/61/07/2961072ce9c7fa492d20a8ee007c4847.jpg"
                  class="d-block w-100  h-140 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>
                    Some representative placeholder content for the second
                    slide.
                  </p>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  src="https://media.istockphoto.com/id/1437629749/photo/land-plot-in-aerial-view-in-chiang-mai-of-thailand.jpg?s=612x612&w=0&k=20&c=07y-L9_WJwFGmvvhrZULYbfTfDtUPHnxJhbxWPTiqYg="
                  class="d-block w-100  h-140 object-cover"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5 class='text-white'>Third slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
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