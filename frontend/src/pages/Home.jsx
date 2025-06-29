import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-10">
      <Hero />
      <Category />
      <BestSeller />
      <NewsLetter />
    </div>
  )
}

export default Home