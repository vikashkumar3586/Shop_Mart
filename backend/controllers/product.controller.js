import Product from '../models/product.model.js';

//add product : /api/product/add-product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category } = req.body;
        if (!name || !price || !offerPrice || !description || !category) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        let imageUrls = [];
        
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }
        
        const product = await Product.create({
            name,
            description,
            price: Number(price),
            offerPrice: Number(offerPrice),
            category,
            image: imageUrls,
        });
        res.status(201).json({ message: 'Product added successfully', success: true });
        
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            success: false,
            error: error.message 
        });
    }
};


//get products : /api/product/get
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json({ products, success: true });
    } catch (error) {
      
        res.status(500).json({ message: 'Internal server error', error });
    }
};

//get single product : /api/product/id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
        res.status(200).json({ product, success: true });
    } catch (error) {
        
        res.status(500).json({ message: 'Internal server error', error });
    }
};

//cheange stock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
       const { id, inStock } = req.body;
         const product = await Product.findByIdAndUpdate(
            id,
            { inStock },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
        res.status(200).json({ product, success: true  , message: 'Stock updated successfully'});
    } catch (error) {
        
        res.status(500).json({ message: 'Internal server error', error });
    }
};
