const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createProducts = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
    // he likes to send empty values first-> so he can see that his validation works
    // res.send('createProducts ... 1845 hours, Feb 9th, 2024');
};

const getAllProducts = async (req, res) => {
    const products = await Product.find({});

    res.status(StatusCodes.OK).json({ products, count: products.length });
    // res.send('getAllProducts ... 1845 hours, Feb 9th, 2024');
};

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product){
        throw new CustomError.NotFoundError(`No product with ID : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
    // res.send('getSingleProduct ... 1845 hours, Feb 9th, 2024');
};

const updateProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product){
        throw new CustomError.NotFoundError(`No product with ID : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
    // res.send('updateProduct ... 1845 hours, Feb 9th, 2024');
};

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (!product){
        throw new CustomError.NotFoundError(`No product with ID : ${productId}`);
    }
    // if product does exist
    await product.remove();

    res.status(StatusCodes.OK).json({ mes: 'product removed successfully.' });
    // res.send('deleteProduct ... 1845 hours, Feb 9th, 2024');
};

const uploadImage = async (req, res) => {
    res.send('uploadImage ... 1845 hours, Feb 9th, 2024');
};

module.exports = {
    createProducts,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}