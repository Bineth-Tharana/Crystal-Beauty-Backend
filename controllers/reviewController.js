import Review from "../models/review.js";
import Product from "../models/product.js";

export async function createReview(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message : "Please login to write a review"
        });
        return;
    }

    const rating = Number(req.body.rating);
    const comment = (req.body.comment || "").trim();
    const productId = req.body.productId;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        res.status(400).json({ message : "Rating must be between 1 and 5" });
        return;
    }
    if (comment.length === 0 || comment.length > 1000) {
        res.status(400).json({ message : "Comment must be 1 to 1000 characters" });
        return;
    }

    try {
        const product = await Product.findOne({ productId : productId });
        if (product == null) {
            res.status(404).json({ message : "Product not found" });
            return;
        }

        const existing = await Review.findOne({
            productId : productId,
            email : req.user.email
        });
        if (existing != null) {
            res.status(409).json({ message : "You have already reviewed this product" });
            return;
        }

        const review = new Review({
            productId : productId,
            productName : product.name,
            email : req.user.email,
            name : req.user.firstName + " " + req.user.lastName,
            rating : rating,
            comment : comment
        });
        await review.save();

        res.status(201).json({ message : "Review added successfully" });
    } catch (err) {
        res.status(500).json({ message : "Failed to add review" });
    }
}

