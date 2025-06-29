import Product from '../models/product.model.js';
// import { v2 as cloudinary } from 'cloudinary';

//add product : /api/product/add-product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category } = req.body;
        const image = req.files?.map((file) => file.filename);
        if (!name || !price || !offerPrice || !description  || !category || !image || image.length === 0) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // const images = req.files;
        
        // let imageUrl = await Promise.all(
        //     images.map(async (item) => {
        //         let result = await cloudinary.uploader.upload(item.path,{
        //             resource_type: "image",
        //         });
        //         return result.secure_url;
        //     })
        // );
        await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image,
            // image: imageUrl,
            
        });
        res.status(201).json({ message: 'Product added successfully', success: true });
    } catch (error) {
    
        res.status(500).json({ message: 'Internal server error', error });
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
