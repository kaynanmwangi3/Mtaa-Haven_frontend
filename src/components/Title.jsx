import '../App.css';
import { Link } from 'react-router-dom';
import './Home.css';

function Title(){
    return(
        <div class="bg-black">
        <div>
          <nav class="flex justify-between pb-1 items-center">
            <div class="flex gap-3 pl-5 items-center">
              <p class="text-white text-2xl"><Link className='link-tag-links'>Home </Link></p>
              <p class="text-white text-2xl"><Link to='/about' className='link-tag-links'>About</Link></p>
              <p class="text-white text-2xl"><Link to='/properties' className='link-tag-links'>Properties</Link></p>
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
              <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input bg-white" />
                <i className="bx bx-search search-icon"></i>
              </div>
              <button class="text-white log-out-btn">
                <i className="bx bx-log-out text-3xl"></i>
              </button>
            </div>
          </nav>
        </div>
      </div>
    )
}
export default Title;