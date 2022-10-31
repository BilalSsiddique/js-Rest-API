const mongoCollection = require("../config/mongoCollections");
const { ObjectId} = require("mongodb");
const movieData = require("./movie");
const movies = mongoCollection.movies;


const exportedMethods = {
  async createReview(id, review) {
    console.log('called')
    
    if (!id){
      throw "id is not valid"
    }

    if (
      !review.reviewTitle ||
      !review.reviewerName ||
      !review.review ||
      !review.rating
    ) {
      
      throw "movie object must have reviewTitle, review, plot, rating ";
    }

    if (
      typeof id !== "string" &&
      typeof movie.reviewTitle !== "string" &&
      typeof movie.reviewerName !== "string" &&
      typeof movie.review !== "string" &&
      typeof movie.rating !== "number"
    ) {
      throw "All fields type must be string"
    }

    if (ObjectId.isValid(id) !== true) {
      throw  "id not valid"
    }

    if (!(review.rating>=1 && review.rating<=5) ) throw 'Rating must be between 1 & 5' 
    const moviesCollection = await movies();
    const movie = await movieData.getMovieById(id);
    const revId = ObjectId(); //create new ID
    const reviews = await this.getAllReviews(id);
    // console.log(reviews)
    
   let sum = 0;
    let average;
    reviews.forEach((rev) => {
      sum += rev.rating;
      average = sum / reviews.length;
    });
   
    let updatedReviews;
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const reviewDate = dd + "/" + mm + "/" + yyyy;
    review.reviewDate= reviewDate
    if (average>0) {
        movie.overallRating = +average.toFixed(1);
        updatedReviews = [{ _id: revId, ...review }, ...movie.reviews];
        await moviesCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { reviews: updatedReviews, overallRating: movie.overallRating } }
        );

        const updatedmovie = await movieData.getMovieById(id);
        return updatedmovie;
  }
  else{
    movie.overallRating = +average
    updatedReviews = [{ _id: revId, ...review }, ...movie.reviews];
    await moviesCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { reviews: updatedReviews, overallRating: movie.overallRating } }
    );
    const updatedmovie = await movieData.getMovieById(id);
    return updatedmovie;
  }

  },
  async getAllReviews(id) {
    if (!id) throw "movie id to search for must be provided";
    if ( typeof id != "string")
      throw "given id must be a non-empty string";
    if (ObjectId.isValid(id) !== true) {
      throw "id not valid";
    }
    const movie = await movieData.getMovieById(id);
    let reviewList = [];
    for (let i = 0; i < movie.reviews.length; i++) {
      reviewList.push(movie.reviews[i]);
    }
    return reviewList;
  },
  async getReview(id) {
    if (!id) throw "review id to search for must be provided";
    if (typeof id !=='string' || id.trim().length<1 ) throw 'id is not string or empty string'
    if (ObjectId.isValid(id) !== true) {
      throw "id not valid";
    }
    const moviesCollection = await movies();
    const movieList = await moviesCollection.find({}).toArray();
    let foundReview = false;
    let review = {};
    for (let i = 0; i < movieList.length; i++) {
      const currentmovie = movieList[i];
      for (let j = 0; j < currentmovie.reviews.length; j++) {
        if (currentmovie.reviews[j]._id.toString() == id) {
          foundReview = true;
          review = currentmovie.reviews[j];
        }
      }
    }
    if (!foundReview) throw "no review with that id";
    return review;
  },
  async removeReview(id) {
    if (!id) throw "review id to search for must be provided";
    if (typeof id !== "string" || id.trim().length < 1)
      throw "id is not string or empty string";
    if (ObjectId.isValid(id) !== true) {
      throw "id not valid";
    }
    const moviesCollection = await movies();
    const movieList = await moviesCollection.find({}).toArray();
    let reviewFound = false;
    let movieId = "";
    let updatedList = [];
    let currentmovie = {};
    for (let i = 0; i < movieList.length; i++) {
      currentmovie = movieList[i];
      let oldReviewsList = currentmovie.reviews;
      for (let j = 0; j < oldReviewsList.length; j++) {
        if (oldReviewsList[j]._id.toString() == id) {
          reviewFound = true;
          movieId = oldReviewsList[j]._id;
          for (let k = 0; k < oldReviewsList.length; k++) {
            if (oldReviewsList[k]._id.toString() == id) {
              continue;
            }
            updatedList.push(oldReviewsList[k]);
          }
        }
        if (reviewFound) break;
      }
      currentmovie.reviews = updatedList;
      if (reviewFound) break;
    }
    if (!reviewFound) {
      throw `could not delete review with id of ${id}`;
    }   
    const newReviews = {};
    newReviews.reviews = currentmovie.reviews;
    
    await moviesCollection.updateOne(
      { _id: currentmovie._id },
      { $set: { reviews: currentmovie.reviews } }
    );
    newmovie = await movieData.getMovieById(currentmovie._id.toString());
    return { reviewId: id, deleted: true };
  },
};

module.exports = exportedMethods;
