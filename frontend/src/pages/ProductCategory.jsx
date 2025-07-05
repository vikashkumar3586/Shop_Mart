import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
  const { products, navigate, fetchProducts } = useContext(AppContext);
  const { category } = useParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );
  
  const availableProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase() && product.inStock
  );

  return (
    <div className='mt-16 px-4'>
      {/* Category Header */}
      {searchCategory && (
        <div className='mb-6'>
          <h1 className='text-3xl md:text-4xl font-medium mb-2'>
            {searchCategory.text.toUpperCase()}
          </h1>
        </div>
      )}

      {/* Products or Empty State */}
      {availableProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {availableProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-2'>
            No products found in {searchCategory?.text || category}
          </p>
          <p className='text-gray-400 text-sm mb-4'>
            Check back soon for new products!
          </p>
          <button 
            onClick={() => navigate('/products')}
            className='text-indigo-600 hover:text-indigo-800 underline'
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCategory