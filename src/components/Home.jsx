import "../App.css";
import "boxicons/css/boxicons.min.css";
import "./Home.css";
import MiddlePart from "./MiddlePart";
import ReviewsSection from "./ReviewsSection";
import ClientsSection from "./ClientstSection";
import Footer from "./Footer.jsx";
import Gallery from "./Gallery.jsx";
import ServicesSection from "./ServicesSection.jsx";
import About from "./About.jsx";

function Home() {
  return (
    <div>
      <MiddlePart />
      <About />
      <ServicesSection/>
        <ReviewsSection />
        <ClientsSection />
        <Gallery/>
        {/* <Footer /> */}
    </div>
  );
}
export default Home;

