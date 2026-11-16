import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    productId : {
        type : String,
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    comment : {
        type : String,
        required : true,
        maxlength : 1000
    },
    // admins can hide a review without deleting it
    isApproved : {
        type : Boolean,
        required : true,
        default : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

// one review per customer per product
reviewSchema.index({ productId : 1, email : 1 }, { unique : true });

const Review = mongoose.model("reviews", reviewSchema);

export default Review;