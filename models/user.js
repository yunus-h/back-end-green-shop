const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String, 
    },
    country: {
        type: String,  
    },
    zip: {
        type: String,
    },
    phone: {
        type: String,
    },
}, { timestamps: true })

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.hashedPassword
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User