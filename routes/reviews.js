
const express = require("express");
const router = express.Router();
const movieData = require("../data/movie");
const reviewData = require("../data/reviews");

// GET /reviews/movieId 
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).json({ error: "no id is given" });
    return;
  }
  try {
    const allReviews = await reviewData.getAllReviews(id);
    if (allReviews.length == 0) {
      res.status(400).json({ error: `no reviews for movie id ${id}` });
      return;
    }
    res.status(200).json(allReviews);
  } catch (e) {
    res.status(404).json({ error: "movie by id not found" });
    return;
  }
});

// POST /reviews/movieId
router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const review = req.body;
  // console.log(review)
  if (!id) {
    res.status(400).json({ error: "no id is given" });
    return;
  }
  if (
    !review.reviewTitle ||
      !review.reviewerName ||
      !review.review ||
      !review.rating
  ) {
    res.status(400).json({ error: "the request body is not valid" });
    return;
  }
  // check if movie ID is found. if not then don't call create Review 
  try {
    await movieData.getMovieById(id);
    // console.log(abc)
  } catch {
    res.status(400).json({ error: "movie by id not found" });
  }
  
  try {
    const reviews = await reviewData.createReview(id, review);
    res.status(200).json(reviews);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// GET /reviews/review/reviewId 
router.get("/review/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  try {
    const review = await reviewData.getReview(id);
    res.status(200).json(review);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

// DELETE /reviews/reviewId 
router.delete("/review/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  try {
    await reviewData.getReview(id);
  } catch (e) {
    res.status(404).json({ error: "review by id not found" });
    return;
  }
  try {
    const deletedReview = await reviewData.removeReview(id);
    res.status(200).json(deletedReview);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;

// {
//     "title": "Dhoom7",
//     "genres":["drama"],
//     "plot":"bilal",
//     "rating":"PG-13",
//     "studio":"abcde",
//     "director":"myname",
//     "castMembers":["abcde","aaaa"],
//     "dateReleased":"02/02/2022",
//     "runtime":"1h 45min"
// }

// {
//     "title": "meh",
//     "reviewer": "Bilal",
//     "rating": 4.5,
//     "dateOfReview": "02/10/2022",
//     "review": "best movie"

// }