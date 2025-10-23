import "../App.css";
import "boxicons/css/boxicons.min.css";
import "./Home.css";
import MiddlePart from "./MiddlePart";

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
            <h5 class="text-white  ">
              123 Maple Street, Springfield, IL 62704
            </h5>
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
            <div class="bg-black flex flex-col items-center justify-center p-2">
              <div class="flex space-x-1 mb-2">
                <i class="bx bxs-star text-yellow-400 text-lg"></i>
                <i class="bx bxs-star text-yellow-400 text-lg"></i>
                <i class="bx bxs-star text-yellow-400 text-lg"></i>
                <i class="bx bxs-star text-yellow-400 text-lg"></i>
                <i class="bx bxs-star text-yellow-400 text-lg"></i>
              </div>
              <h1 class="text-white font-serif tracking-widest uppercase">
                Mtaa Haven
              </h1>
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
      <MiddlePart />
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
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia
            odit omnis inventore autem sed fuga laboriosam modi harum sunt
            reprehenderit adipisci perferendis, officia dolorem dolores maiores
            maxime incidunt quasi voluptates quo provident nulla hic, voluptas
            quidem? Dicta similique, nihil dignissimos odit facilis doloribus
            blanditiis, sed laboriosam pariatur voluptatum vitae numquam.
            <br />
            <br />
            <i class="bx bxs-star text-yellow-400"></i> Sed ut perspiciatis unde
            omnis iste .<br />
            <i class="bx bxs-star text-yellow-400"></i> natus error sit
            voluptatem accusantium doloremque.
            <br />
            <i class="bx bxs-star text-yellow-400"></i> laudantium totam rem
            aperiam, eaque ipsa quae.
            <br />
            <i class="bx bxs-star text-yellow-400"></i> ab illo inventore
            veritatis et quasi architecto beatae .
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
        <button class="px-8 py-3 border border-white text-white  hover:bg-white  transition-all duration-300 tracking-widest uppercase font-semibold rounded-md">
          Join Us
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
        <div>
          <div className="relative h-150 w-350 bg-[url('https://www.usnews.com/object/image/0000018d-65b2-d883-a7ed-6dbe13990001/49-ritz-carlton-orlando-grande-lakes.jpeg?update-time=1706808185106&size=responsive640')] bg-cover bg-center flex flex-col items-center justify-center text-white">
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="relative w-full flex flex-col items-center justify-center text-center space-y-16">
              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase">
                Our Services
              </h2>

              {/* 3-column layout */}
              <div className="w-4/5 md:w-3/4 flex flex-col md:flex-row justify-between text-2xl md:text-3xl font-light uppercase divide-y md:divide-y-0 md:divide-x divide-white/40">
                <div className="py-6 md:py-0 md:px-10">AIRBNB's</div>
                <div className="py-6 md:py-0 md:px-10">APARTMENTS</div>
                <div className="py-6 md:py-0 md:px-10">HOSTELS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class='flex text-white justify-center gap-3 mt-3'>
          <i class="bx bx-right-arrow-alt text-3xl"></i>
          <h3>OUR PACKAGES</h3>
          <i class="bx bx-left-arrow-alt text-3xl"></i>
        </div>
        <div class='flex text-white justify-center mt-2 mb-10'> 
          <h3>PACKAGES WE OFFER</h3>
        </div>
        <div>
          <div class="min-h-screen  text-white flex flex-col items-center ">
            <div class="flex flex-col md:flex-row justify-center items-center gap-10 ">
              <div
                class="relative w-72 h-[420px] bg-[url('https://cdn.prod.website-files.com/684c437bd1bedfba51264f73/68586e619d508827024406b2_pexels-pixabay-258154-p-1080.jpg')] bg-cover bg-center rounded-md overflow-hidden shadow-lg"
              >
                <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 transition-all duration-300 hover:bg-black/60">
                  <h3 class="text-xl font-light uppercase tracking-wide mb-4">
                    Weekend Retreat Package
                  </h3>
                  <p class="text-lg font-medium">9999.99 KSH</p>
                </div>
              </div>

              <div
                class="relative w-72 h-[420px] bg-[url('https://cdn.prod.website-files.com/684c437bd1bedfba51264f73/68586e70c65aeb6bec2b79cc_pexels-tr-n-long-3093985-7743572-p-1080.jpg')] bg-cover bg-center rounded-md overflow-hidden shadow-lg"
              >
                <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 transition-all duration-300 hover:bg-black/60">
                  <h3 class="text-xl font-light uppercase tracking-wide mb-4">
                    Family Fun Getaway
                  </h3>
                  <p class="text-lg font-medium">9999.99 KSH</p>
                </div>
              </div>

              <div
                class="relative w-72 h-[420px] bg-[url('https://cdn.prod.website-files.com/684c437bd1bedfba51264f73/68586be7bc6b6874a4766536_honeymoon-p-1080.jpg')] bg-cover bg-center rounded-md overflow-hidden shadow-lg"
              >
                <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 transition-all duration-300 hover:bg-black/60">
                  <h3 class="text-xl font-light uppercase tracking-wide mb-4">
                    Honeymoon Package
                  </h3>
                  <p class="text-lg font-medium">9999.99 KSH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class='flex items-center justify-center'>
            <p  class='text-white text-3xl'>REVIEW FORM CUSTOMERS</p>
        </div>
        <div class='w-60  bg-gray-700'>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde esse provident doloremque non error, voluptatibus officia necessitatibus, nesciunt tenetur ex blanditiis voluptate nemo, quod commodi nostrum accusantium ut. Deserunt possimus ea corporis iure beatae, labore error accusamus temporibus aliquam dolores alias, quisquam asperiores porro eum nobis eos natus nisi sed.</p>
        </div>
      </div>
    </div>
  );
}
export default Home;

