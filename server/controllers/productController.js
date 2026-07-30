import Product from '../models/Product.js';

const FALLBACK_PRODUCTS = [
    {
        _id: 'fb-1',
        name: 'Manual Wheelchair',
        description: 'Durable manual wheelchair with comfortable seating and easy-fold mechanism. Suitable for indoor and outdoor use.',
        price: 5999,
        rentPricePerDay: 150,
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-2',
        name: 'Electric Wheelchair',
        description: 'Battery-powered electric wheelchair with joystick control. Long battery life and smooth ride technology.',
        price: 45000,
        rentPricePerDay: 800,
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-3',
        name: 'Standard Hospital Bed',
        description: 'Manual crank hospital bed with adjustable head and foot sections. Includes side rails and IV pole holder.',
        price: 18000,
        rentPricePerDay: 500,
        category: 'Hospital Beds',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-4',
        name: 'ICU Bed with Side Rails',
        description: 'Premium ICU-grade bed with full electric adjustment, CPR function, and collapsible side rails.',
        price: 35000,
        rentPricePerDay: 900,
        category: 'Hospital Beds',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-5',
        name: '5L Oxygen Concentrator',
        description: 'Continuous flow 5 Liters per minute oxygen concentrator with purity indicator (>93% purity). Quiet operation.',
        price: 32000,
        rentPricePerDay: 750,
        category: 'Oxygen Concentrators',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-6',
        name: 'Paracetamol 650mg (Pack of 15)',
        description: 'Effective analgesic and antipyretic medicine for fever relief and mild to moderate pain relief.',
        price: 35,
        rentPricePerDay: 0,
        category: 'Pain Relief',
        subCategory: 'medicine',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    },
    {
        _id: 'fb-7',
        name: 'Multivitamin Capsules (30s)',
        description: 'Daily essential health supplement to boost immunity, energy, and overall wellbeing.',
        price: 249,
        rentPricePerDay: 0,
        category: 'Vitamins & Supplements',
        subCategory: 'medicine',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&h=400&fit=crop',
        isTrending: true,
        inStock: true
    }
];

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
        console.warn('MongoDB Product fetch failed, using fallback list:', error.message);
        const { category, subCategory, trending, search } = req.query;
        let list = FALLBACK_PRODUCTS;

        if (category && category !== 'All') {
            list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (subCategory) {
            list = list.filter(p => p.subCategory === subCategory);
        }
        if (trending === 'true') {
            list = list.filter(p => p.isTrending);
        }
        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        res.json(list);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            return res.json(product);
        }
    } catch (error) {
        // Look in fallback
    }

    const fallback = FALLBACK_PRODUCTS.find(p => p._id === req.params.id);
    if (fallback) {
        return res.json(fallback);
    }

    res.status(404).json({ error: 'Product not found.' });
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, rentPricePerDay, category, subCategory, image, isTrending, inStock, requiresPrescription } = req.body;

        const product = new Product({
            name,
            description,
            price: Number(price),
            rentPricePerDay: rentPricePerDay ? Number(rentPricePerDay) : 0,
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
            product.rentPricePerDay = req.body.rentPricePerDay !== undefined ? Number(req.body.rentPricePerDay) : product.rentPricePerDay;
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
