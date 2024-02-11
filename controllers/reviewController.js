const Product = require('../models/Product');
const Review = require('../models/Review');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body; // productId is the alias here
    // check if there is a product ID
    const isValidProduct = await Product.findOne({ _id: productId});

    if (!isValidProduct){
        throw new CustomError.NotFoundError(`Nope, no Product with id : ${productId}`);
    }
    // check if user already submitted a review for this particular product
    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId,
    });

    if (alreadySubmitted){
        throw new CustomError.BadRequestError('You formerly reviewed this product ');
    }

    req.body.user = req.user.userId; // we have the middleware, that is why we can do this
    const review = await Review.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ review });
    // res.send('createReview. Feb 10th, 2024, what are you running from, rejection?. course is taking way too long');
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({});
    // everytime, we have a list, it is useful for the frontend to have the count
    res.status(StatusCodes.OK).json({ reviews, count: reviews,length });
    // res.send('getAllReviews. Feb 10th, 2024, what are you running from, rejection?. course is taking way too long');
};

const getSingleReview = async (req, res) => {
    const { id: reviewId}  = req.params
    // res.send('getSingleReview. Feb 10th, 2024, what are you running from, rejection?. course is taking way too long');
};

const updateReview = async (req, res) => {
    res.send('updateReview. Feb 10th, 2024, what are you running from, rejection?. course is taking way too long');
};

const deleteReview = async (req, res) => {
    res.send('deleteReview. Feb 10th, 2024, what are you running from, rejection?. course is taking way too long');
};

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
};

