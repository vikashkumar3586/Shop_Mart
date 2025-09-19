import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import Hero from "../components/Hero";
import Poster from '../components/Poster';

const Home = () => {
    const { products, fetchProducts } = useContext(AppContext);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        console.error('❌ Failed to load products on Home page:', error);
      }
    };
    
    loadProducts();
  }, []);
  return (
    <div className="mt-10">
      <Hero />
      <Category />
      <BestSeller />
      <Poster />

    </div>
  )
}

export default Home