const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const saltRounds = 12

router.post('/sign-up', async (req,res) => {
    try {
        //check the username exists or not
        const userInDatabase = await User.findOne({ username: req.body.username})
        if (userInDatabase) {
            return res.status(409).json({ err: 'Username already taken!' })
        }

        // otherwise, let's create a new user
        const user = await User.create ({
            role: req.body.role,
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            phone: req.body.phone,
        })

        //let's define our payload
        const payload = { 
            _id: user._id,
            role: user.role,
            username: user.username,
            name: user.name,
            email: user.email,
            address: user.address,
            city: user.address,
            state: user.state,
            country: user.country,
            zip: user.zip,
            phone: user.phone,
        }

        // create the token based on the above payload
        const token = jwt.sign({ payload }, process.env.JWT_SECRET)

        //send the data as a token
        res.status(201).json({ token })

    } catch (err) {
        res.status(500).json({ err: err.message})
    }
})

router.post('/sign-in', async (req, res) => {
    try {
        // find the user based on their username
        const user = await User.findOne ({ username: req.body.username })
        
        // if the user does not exists, give them 401 error
        if(!user) {
            return res.status(401).json({ err: 'Excuse me! Your username or password was incorrect. Please double-check your username or password.' })
        }

        // check password is correct using bcrypt
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword)

        // if the password is incorrect, return 401
        if (!isPasswordCorrect) {
            return res.status(401).json({ err: 'Excuse me! Your username or password was incorrect. Please double-check your username or password.' })
        }

         //let's define our payload
         const payload = { 
            _id: user._id,
            role: user.role,
            username: user.username,
            name: user.name,
            email: user.email,
            address: user.address,
            city: user.address,
            state: user.state,
            country: user.country,
            zip: user.zip,
            phone: user.phone,
        }

        // create the token based on the above payload
        const token = jwt.sign({ payload }, process.env.JWT_SECRET)

        //send the data as a token
        res.status(200).json({ token }) 

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

module.exports = router