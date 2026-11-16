import express from "express";
import {createReview,getProductReviews,getAllReviews,setReviewVisibility,deleteReview} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.get("/", getAllReviews);
reviewRouter.put("/:id/visibility", setReviewVisibility);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;