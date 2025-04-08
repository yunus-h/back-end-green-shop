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
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    accCreationDate: {
        type: Date,
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.hashedPassword
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User