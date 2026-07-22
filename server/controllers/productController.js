import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const { category, subCategory, search, trending } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (subCategory) {
            query.subCategory = subCategory;
        }

        if (trending === 'true') {
            query.isTrending = true;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, rentPricePerMonth, category, subCategory, image, isTrending, inStock, requiresPrescription } = req.body;

        const product = new Product({
            name,
            description,
            price: Number(price),
            rentPricePerMonth: rentPricePerMonth ? Number(rentPricePerMonth) : 0,
            category,
            subCategory: subCategory || 'equipment',
            image: image || '',
            isTrending: Boolean(isTrending),
            inStock: inStock !== undefined ? Boolean(inStock) : true,
            requiresPrescription: Boolean(requiresPrescription)
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
            product.rentPricePerMonth = req.body.rentPricePerMonth !== undefined ? Number(req.body.rentPricePerMonth) : product.rentPricePerMonth;
            product.category = req.body.category || product.category;
            product.subCategory = req.body.subCategory || product.subCategory;
            product.image = req.body.image !== undefined ? req.body.image : product.image;
            product.isTrending = req.body.isTrending !== undefined ? Boolean(req.body.isTrending) : product.isTrending;
            product.inStock = req.body.inStock !== undefined ? Boolean(req.body.inStock) : product.inStock;
            product.requiresPrescription = req.body.requiresPrescription !== undefined ? Boolean(req.body.requiresPrescription) : product.requiresPrescription;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed successfully.' });
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
