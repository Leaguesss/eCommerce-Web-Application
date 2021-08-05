var mongoose = require('mongoose')


var PhoneSchema = new mongoose.Schema({
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: String,
    price: Number,
    reviews: Array,
    disabled: String,
    rating_average: Number,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    
}, {
    versionKey: false
});

// Find 5 phone listings that have the least quantity available (more than 0 quantity and not disabled)
PhoneSchema.statics.searchLeastQuantity = function (callback) {
    return this.find({ stock: { $gt: 0 }, disabled: { $exists: false } })
        .sort({ stock: 1 })
        .limit(5)
        .exec(callback)
}

// Find 5 phone listings that have the highest average rating (not disabled and at least two ratings given)
PhoneSchema.statics.searchHighestRating = function (callback) {
    // return this.find( { "reviews.1": {$exists:1}, disabled: {$exists: false} } )
    // .sort({rating_average: -1})
    // .limit(5)
    // .exec(callback)
    // this.aggregate([
    //     { "$addFields": 
    //         { "rating_average": 
    //             { "$avg": "$reviews.rating" } 
    //         } 
    //     },
    //     { "$out": "phonelisting" }
    // ]);
    return this.aggregate([
            { "$addFields": 
                { "rating_average": 
                    { "$avg": "$reviews.rating" } 
                } 
            },
            {
                "$match":{
                    "reviews.1": { $exists: true }, 
                    disabled: { $exists: false }
                }
            }
        ]).sort({ rating_average: -1 }).limit(5).exec(callback);
}

// Find phone listings match with search Title
PhoneSchema.statics.searchTitle = function (searchTitle, callback) {
    return this.find({ title: { '$regex': searchTitle, '$options': 'i' } , disabled: { $exists: false }})
        .sort({ brand: 1 })
        .exec(callback);
}

//Find all phones listings created/associated to this user (ID) 
PhoneSchema.statics.searchListings = function (id, callback) {
    return this.find({ 'seller': id }).exec(callback)
}

// Find the details of the selected phone
PhoneSchema.statics.searchSelected = function (id, callback) {
    return this.find({ "_id": id })
        .exec(callback)
}

//Insert new comments into the specific phone
PhoneSchema.statics.addNewComments = function (itemId, newComments, callback) {
    return this.update({ '_id': itemId }, { $push: { 'reviews': newComments } }).exec(callback);
}

// User buy phones
PhoneSchema.statics.buyPhones = function(itemId, newQuantity, callback){
    return this.update({'_id': itemId}, {$set:{'stock': newQuantity}}).exec(callback);
}


var Phonelist = mongoose.model('phonelisting', PhoneSchema, 'phonelisting')
module.exports = Phonelist
