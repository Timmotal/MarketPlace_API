const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
// const jwt = require('jsonwebtoken'); // taken out to utils
// const { createJWT } = require('../utils'); // REFACTORED OUT
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const express = require('express');
const router = express.Router();

const register = async (req, res) => {

    const { name, email, password } = req.body; // pullout the email

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }

    // first registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0; // if equal to null
    // we can count documents based on some condition 
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role});
    // const user = await User.create(req.body); // right here is where we created the user into the database

    const tokenUser = createTokenUser(user);
    // const tokenUser = { name:user.name, userId:user._id, role:user.role }; // we dont wanna send back the whole user obj
    // const token = createJWT({ payload: tokenUser }); REFACTORED OUT to jwt

    attachCookiesToResponse({ res, user:tokenUser }); // attach cookies to the response

    // <<< REFACTORED OUT - to UTILS >>>
    // const token = jwt.sign(tokenUser, 'jwtSecret', { expiresIn: '1D' }); // need to pass '3; values, [payload, ,]
    // very useful to send the 'ID', because you will use it to access resources
    // in our case we also wanna pass in the role for some role based authentication
    // just for kicks, we will pass in the name

    // REFACTORED OUT
    // const oneDay = 1000 * 60 * 60 * 24; 

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + oneDay)
    // });

    res.status(StatusCodes.CREATED).json({ user: tokenUser }); //-> commented out for now---to--JWT-----------
    // res.status(StatusCodes.CREATED).json({ user: tokenUser, token }) // for testing, we send back the whole user
    // res.send('register user');
};

const login = async (req, res) => {
    // res.send('login user');
    const { email, password } = req.body;
    if ( !email || !password ) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });

    if ( !user ) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');

    }
    // we are not looking for the model -> we are looking for the instance already
    const isPasswordCorrect = await user.comparePassword(password);
    if ( !isPasswordCorrect ) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser = createTokenUser(user);
    // taken out to utils
    // const tokenUser = { name: user.name, userId: user._id, role:user.role };
    attachCookiesToResponse({ res, user: tokenUser }); 
    res.status(StatusCodes.CREATED).json({ user: tokenUser }); 
};

const logout = async ( req, res ) => {
    res.cookie( 'token', 'logout', {
        httpOnly: true,
        expires: new Date( Date.now()),
        // expires: new Date( Date.now() + 5 * 1000 ),
    });
    // res.send('logout user');
    res.status( StatusCodes.OK ).json({ msg: 'user logged out! '}); // just for dev purpose, frontend wont use this
};

module.exports = {
    register,
    login,
    logout,
}