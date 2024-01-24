const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
    // res.send('..get all users route...Jan 4th, 2024, 1259 hours.');
};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id:req.params.id}).select('-password');

    if (!user){
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ user });
    // res.send('Get a single user...Jan 4th, 2024, 1259 hoursJan 4th, 2024, 1259 hours...');
    // res.send(req.params);
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user:req.user}); // you can check req.user directly tho
    // res.send('show current users Route...Jan 4th, 2024, 1259 hours');
};

const updateUser = async (req, res) => {
    res.send('update a user......Jan 4th, 2024, 1259 hours');
    // res.send(req.body);
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('Kindly provide both values... Jan 7th, 1041 hours, 2024');
    }
    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    // if both checks above got passed, then do below
    user.password = newPassword;
    await user.save(); // password is still hashed, because this method invokes the presave. which uses bcrypt

  ;
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};

