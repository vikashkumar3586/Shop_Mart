import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, searchQuery, fetchProducts } = useContext(AppContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const availableProducts = filteredProducts.filter((product) => product.inStock);

  return (
    <div className="mt-16 px-4">
      <h1 className='text-3xl lg:text-4xl font-medium mb-6'>All Products</h1>
      
      {/* ✅ Products grid or empty state */}
      {availableProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {availableProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchQuery ? 'Try searching for something else' : 'Check back soon for new products!'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Products