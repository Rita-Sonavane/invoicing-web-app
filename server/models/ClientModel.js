const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    building: String,
    addressLine1:String,
    city: String,
    state : String,
    countryCode: String,
    country: String,
    mobile : String,
    fax : String,
    postalCode :String,
    userId: [String],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const ClientModel = mongoose.model('ClientModel', ClientSchema)
module.exports = ClientModel;