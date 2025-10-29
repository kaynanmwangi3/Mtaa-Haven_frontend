import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './Home.css';

function Title(){
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

     return(
         <div class="bg-black">
         <div>
           <nav class="flex justify-between pb-1 items-center">
             <div class="flex gap-3 pl-5 items-center">
               <p class="text-white text-2xl"><Link to='/' className='link-tag-links'>Home </Link></p>
               <p class="text-white text-2xl"><Link to='/about' className='link-tag-links'>About</Link></p>
               {isAuthenticated && (
                 <>
                   <p class="text-white text-2xl"><Link to='/properties' className='link-tag-links'>Properties</Link></p>
                   <p class="text-white text-2xl"><Link to='/dashboard' className='link-tag-links'>Dashboard</Link></p>
                 </>
               )}
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
             <div class="flex gap-3 pr-5 items-center">
               {isAuthenticated ? (
                 <>
                   <span className="text-white text-lg">Welcome, {user?.first_name}</span>
                   <Link to='/profile' className='text-white hover:text-gray-300 transition-colors'>
                     <i className="bx bx-user text-2xl"></i>
                   </Link>
                   <button onClick={handleLogout} class="text-white log-out-btn">
                     <i className="bx bx-log-out text-3xl"></i>
                   </button>
                 </>
               ) : (
                 <>
                   <div className="search-container">
                     <input
                     type="text"
                     placeholder="Search property..."
                     className="search-input bg-white" />
                     <i className="bx bx-search search-icon"></i>
                   </div>
                   <Link to='/login' className='text-white hover:text-gray-300 transition-colors'>
                     <i className="bx bx-log-in text-3xl"></i>
                   </Link>
                 </>
               )}
             </div>
           </nav>
         </div>
       </div>
     )
 }
 export default Title;