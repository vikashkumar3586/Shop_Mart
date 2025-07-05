import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
const BestSeller = () => {
    const {products}= useContext(AppContext);
    const availableProducts = products.filter((product) => product.inStock)

  return (
    <div className="mt-16 px-4">
        <p className="text-2xl font-medium md:text-3xl mb-6">Best Sellers</p>
        <div className='my-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-center justify-center'>
            {products.filter((product) => product.inStock).slice(0,5).map((product,index) => (
                <ProductCard key={index} product={product} />
            )) }
        </div>
         {availableProducts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No products available at the moment</p>
                </div>
            )}
    </div>
  )
}

export default BestSeller