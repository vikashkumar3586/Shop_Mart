import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
const Poster = () => {
  return (
    <div className="relative z-0">
      <img src={assets.bottom_banner_image} alt="" className='hidden md:block w-full' />
      <img src={assets.bottom_banner_image_sm} alt="" className='md:hidden w-full' />
      <div className='absolute inset-0 flex flex-col items-center 
md:items-end justify-end md:justify-center pb-24 md:pb-0 md:pr-18 lg:pr-24'>
        {/* Right Side: Why We Are the Best */}
      <div className="flex-1 flex flex-col items-start  md:pl-16 mt-8">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-500 mb-8">Why We Are the Best?</h2>
        <ul className="space-y-6">
          <li className="flex items-start gap-4">
            <img src={assets.delivery_truck_icon} alt="" className=''/>
            <div>
              <div className="font-bold text-lg text-gray-700">Fastest Delivery</div>
              <div className="text-gray-500 text-sm">Groceries delivered in under 30 minutes.</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
           <img src={assets.leaf_icon} alt="" />
            <div>
              <div className="font-bold text-lg text-gray-700">Freshness Guaranteed</div>
              <div className="text-gray-500 text-sm">Fresh produce straight from the source.</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <img src={assets.coin_icon} alt="" />
            <div>
              <div className="font-bold text-lg text-gray-700">Affordable Prices</div>
              <div className="text-gray-500 text-sm">Quality groceries at unbeatable prices.</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <img src={assets.trust_icon} alt="" />
            <div>
              <div className="font-bold text-lg text-gray-700">Trusted by Thousands</div>
              <div className="text-gray-500 text-sm">Loved by 10,000+ happy customers.</div>
            </div>
          </li>
        </ul>
      </div>

      {/* End of Right Side */}
      </div>
    </div>
  )
}

export default Poster