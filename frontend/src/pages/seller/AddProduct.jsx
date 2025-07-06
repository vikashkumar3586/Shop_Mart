import { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const { axios, fetchProducts } = useContext(AppContext);
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!name || !description || !price || !offerPrice || !category) {
                toast.error('Please fill all fields');
                return;
            }

            if (files.length === 0 || !files.some(file => file)) {
                toast.error('Please select at least one image');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('offerPrice', offerPrice);
            formData.append('category', category);

            // ✅ Only append valid files
            files.forEach((file, index) => {
                if (file && file instanceof File) {
                    formData.append('image', file);
                }
            });

            // ✅ Debug: Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // ✅ Make sure the endpoint is correct
            const { data } = await axios.post('/api/product/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 seconds timeout
            });

            if (data.success) {
                toast.success(data.message || 'Product added successfully');
                
                // Reset form
                setName('');
                setDescription('');
                setPrice('');
                setOfferPrice('');
                setCategory('');
                setFiles([]);
                
                // Refresh products
                if (fetchProducts) {
                    await fetchProducts();
                }
            } else {
                toast.error(data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error("Error uploading product:", error);
            
            // ✅ Better error handling
            if (error.response) {
                toast.error(error.response.data?.message || 'Server error occurred');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('Failed to upload product');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-10 flex flex-col justify-between bg-white">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (!file.type.startsWith('image/')) {
                                                toast.error('Please select only image files');
                                                return;
                                            }
                                            
                                            if (file.size > 5 * 1024 * 1024) {
                                                toast.error('Image size should be less than 5MB');
                                                return;
                                            }
                                            
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = file;
                                            setFiles(updatedFiles);
                                        }
                                    }} 
                                    accept="image/*" 
                                    type="file" 
                                    id={`image${index}`} 
                                    hidden 
                                    disabled={isSubmitting}
                                />
                                <img 
                                    className="max-w-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2" 
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} 
                                    alt="uploadArea" 
                                    width={100} 
                                    height={100} 
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input 
                        id="product-name" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type here" 
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                        required 
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                        id="product-description" 
                        rows={4} 
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" 
                        placeholder="Type here"
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select 
                        id="category" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                        disabled={isSubmitting}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.path}>{category.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            id="product-price" 
                            type="number" 
                            placeholder="0" 
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                            required 
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input 
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)} 
                            id="offer-price" 
                            type="number" 
                            placeholder="0" 
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                            required 
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Adding...
                        </>
                    ) : (
                        'ADD'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;