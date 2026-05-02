import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import productModel from '../models/productModel.js'


const addProduct = async (req, res) => {
    try {
        const { body = {}, files = {} } = req;

        const getValue = (keys) => {
            const key = keys.find(k => body[k] != null);
            return body[key] ?? '';
        };

        const name = getValue(['name', 'Name']).toString().trim();
        const description = getValue(['description', 'Description']).toString().trim();
        const priceRaw = getValue(['price', 'Price']);
        const category = getValue(['category', 'Category']).toString().trim();
        const subCategory = getValue(['subCategory', 'subcategory', 'SubCategory']).toString().trim();
        const sizesRaw = getValue(['sizes', 'Sizes', 'size', 'Size']);
        const bestsellerRaw = getValue(['bestseller', 'Bestseller']);

        if (!name || !description || !priceRaw || !category || !subCategory || !sizesRaw) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, price, category, subCategory and sizes are required'
            });
        }

        // Parse price
        const price = Number(priceRaw);
        if (Number.isNaN(price)) {
            return res.status(400).json({ success: false, message: 'Price must be a number' });
        }

        // Parse sizes
        const sizes = Array.isArray(sizesRaw) ? sizesRaw : JSON.parse(sizesRaw);
        if (!Array.isArray(sizes)) {
            return res.status(400).json({
                success: false,
                message: 'Sizes must be an array or JSON array string'
            });
        }

        // Upload images
        const images = ['image1', 'image2', 'image3', 'image4']
            .map(k => files[k]?.[0])
            .filter(Boolean);

        const imagesUrl = await Promise.all(
            images.map(img =>
                cloudinary.uploader.upload(img.path, { resource_type: 'image' })
                    .then(r => r.secure_url)
            )
        );

        // Create and save product — store sizes into the schema field `size`
        const product = new productModel({
            name,
            description,
            category,
            price,
            subCategory,
            bestseller: bestsellerRaw === 'true' || bestsellerRaw === true,
            size: sizes,
            image: imagesUrl,
            date: Date.now(),
        });

        await product.save();
        return res.status(201).json({ success: true, message: 'Product added' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
        // console.log(products)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Product removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const singleProduct = async (req, res) => {
    try {
        const id = req.body?.productId ?? req.body?.id ?? req.params?.id
        if (!id) return res.status(400).json({ success: false, message: 'product id is required' })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid product id' })

        const product = await productModel.findById(id).lean()
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        return res.json({ success: true, product })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, message: err.message })
    }
}

export { listProduct, addProduct, removeProduct, singleProduct }
