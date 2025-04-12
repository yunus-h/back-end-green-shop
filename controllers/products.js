const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Product = require('../models/product')
const router = express.Router()

router.post('/', verifyToken, async(req, res) => {
    try {
        req.body.author = req.user._id

        const product = await Product.create(req.body)

        product._doc.author = req.user

        res.status(201).json(product)

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.find({})
        .populate('author')
        .sort({CreatedAt: 'desc'})

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/:productId', verifyToken, async(req,res) => {
    try {
        const product = await Product.findById(req.params.productId).populate([
            'author',
            'reviews.author'
        ])
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.put('/:productId', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)

        if(!product.author.equals(req.user._id)) {
            return res.status(403).json({err: "You are not the author of this product!"})
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {new: true})

        updatedProduct._doc.author = req.user

        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.delete('/:productId', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)

        if(!product.author.equals(req.user._id)) {
            return res.status(403).json({err: "You are not the author of this product!"})
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.productId)

        res.status(200).json(deletedProduct)

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.post('/:productId/reviews', verifyToken, async (req,res) => {
    try {
        req.body.author = req.user._id

        const product = await Product.findById(req.params.productId)

        product.reviews.push(req.body)

        await product.save()

        const newreview = product.reviews[product.reviews.length - 1]

        newreview._doc.author = req.user

        res.status(201).json(newreview)

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.put("/:productId/reviews/:reviewId", verifyToken, async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      const review = product.reviews.id(req.params.reviewId);
  
      // ensures the current user is the author of the review
      if (review.author.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this review" });
      }
  
      review.text = req.body.text;
      review.rating = req.body.rating;
    
      await product.save();
      res.status(200).json({ message: "review updated successfully" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

  router.delete("/:productId/reviews/:reviewId", verifyToken, async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      const review = product.reviews.id(req.params.reviewId);
  
      // ensures the current user is the author of the review
      if (review.author.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this review" });
      }
  
      product.reviews.remove({ _id: req.params.reviewId });
      await product.save();
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

module.exports = router