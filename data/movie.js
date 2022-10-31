

const moment = require("moment");
const mongoCollection = require("../config/mongoCollections");
const movies = mongoCollection.movies;
const { ObjectId } = require("mongodb");

const exportedMethods = {
  async createMovie(movie) {
    
    if (!movie) {
      throw "movie object must be given";
    }
    
    if (
      !movie.title ||
      !movie.genres ||
      !movie.plot ||
      !movie.rating ||
      !movie.studio ||
      !movie.director ||
      !movie.castMembers ||
      !movie.dateReleased ||
      !movie.runtime
    ) {
      
      throw "movie object must have title, genre, plot, rating, studio, director, castMembers, dateReleased and runtime ";
    }
    
    
    if (
      typeof movie.title !== "string" &&
      typeof movie.plot !== "string" &&
      typeof movie.rating !== "string" &&
      typeof movie.studio !== "string" &&
      typeof movie.director !== "string" &&
      typeof movie.dateReeased !== "string" &&
      typeof movie.runtime !== "string"
    ) {
      
      throw "All fields type must be string"
    }

    if (
      movie.title.trim().length < 1 &&
      movie.plot.trim().length < 1 &&
      movie.rating.trim().length < 1 &&
      movie.director.trim().length < 1 &&
      movie.dateReleased.trim().length < 1 &&
      movie.runtime.trim().length < 1
    ){
      
      throw "All fields needs to have valid values"
    }


    if (
      
      movie.title.length < 2 &&
      !(/[a-zA-Z0-9]+$/.test(movie.title)) &&
      !(/^[A-Z][a-z]+[,.'-]?(?: [A-Z][a-z]+[,.'-]?)*$/.test(movie.studio)) &&
      movie.studio.length < 5 &&
      movie.director
        .split(" ")
        .every(
          (item) =>
            item.length < 3 &&
            /^[A-Z][a-z]+[,.'-]?(?: [A-Z][a-z]+[,.'-]?)*$/.test(item) === true
        )
    ){
      throw "Enter valid title"
    }

    const li = ["G", "PG", "PG-13", "R", "NC-17"]
    if (!(li.includes(movie.rating))){
      throw "rating error"
    }

    if (typeof movie.title != "string") {
      console.log('in')
      throw "title must be a string";
    }

    if (!Array.isArray(movie.genres) || movie.genres.length == 0) {
      console.log('in')
      throw "genre should be an array of non-empty strings";
    }
    for (i = 0; i < movie.genres.length; i++) {
      movie.genres[i] = movie.genres[i].trim();
      if (typeof movie.genres[i] != "string" || movie.genres[i].length == 0) {
      console.log('in')
        throw "genres should be an array of non-empty strings";
      }
    }

    if (
      Array.isArray(movie.castMembers) !== true &&
      movie.castMembers.length < 1 &&
      movie.castMembers.every(
        (item) =>
          typeof item !== "string" &&
          /^[A-Za-z]+[,.'-]?(?: [A-Z][a-z]+[,.'-]?)*$/.test(item) ===
            false
      )
    ){
      console.log('in')
      throw "castMembers contain only numbers"
    }

    if (
      movie.castMembers.every((item) => {
        const name = item.split(" ");
        const [first, last] = name;
        return first.length < 3 && last.length < 3;
      })
    ){
      console.log('in')
      throw "first name and last name must be grater than 3 characters"
    }


    const [month, day, year] = movie.dateReleased.split("/");
    const dateReleasedCom = new Date(
      +year,
      +month - 1,
      +day
    ).getFullYear();
    //comparison hard coded
    const [months, days, years] = "01/01/1900".split("/");
    const check = new Date(
      +years,
      +months - 1,
      +days
    ).getFullYear();
    
    if (
      !(moment(movie.dateReleased, "MM/DD/YYYY", true).isValid()) &&
      dateReleasedCom < check &&
      dateReleasedCom > new Date().getFullYear() + 2
    ) {
      
      throw "date is not valid format"
    }
    const moviesCollection = await movies();
    const insertInfo = await moviesCollection.insertOne(movie);
    if (insertInfo.insertedCount === 0) throw "could not add movie";

    const newmovie = await this.getMovieById(insertInfo.insertedId);
    return newmovie;
  },
  async getAllMovies() {
    const moviesCollection = await movies();
    const movieList = await moviesCollection.find({}).toArray();
    return movieList;
  },
  async getMovieById(id) {
    if (!id) {
      throw "Id is not provided";
    }
    if (typeof id === "string") {
      if (id.trim().length === 0) {
        throw  new Error ("id is not string or id is empty")
      }
    }
    if (typeof id === 'string' || id instanceof ObjectId) {
      
      id= ObjectId(id)
      // console.log(id)
      try {
        const data = await movies();
        const response = await data.findOne({ _id: id });
        
        if (response !== null) {
          response._id = response._id.toString();
          return response;
        } else {
          throw "provided id is not in database";
        }
      } catch (err) {
        console.log(err);
      }
  }
  },
  async updateMovie(id, movie) {
    if (
      !movie.title ||
      !movie.genres ||
      !movie.plot ||
      !movie.rating ||
      !movie.studio ||
      !movie.director ||
      !movie.castMembers ||
      !movie.dateReleased ||
      !movie.runtime
    ) {
      
      throw "movie object must have title, genre, plot, rating, studio, director, castMembers, dateReleased and runtime ";
    }

    if (
      typeof movie.title !== "string" &&
      typeof movie.plot !== "string" &&
      typeof movie.rating !== "string" &&
      typeof movie.studio !== "string" &&
      typeof movie.director !== "string" &&
      typeof movie.dateReeased !== "string" &&
      typeof movie.runtime !== "string"
    ) {
      
      throw "All fields type must be string"
    }

    if (ObjectId.isValid(id) !== true) {
      throw new Error ( "id not valid")
      
    }

    if (!Array.isArray(movie.genres) || movie.genres.length == 0) {
      console.log('in')
      throw "genre should be an array of non-empty strings";
    }
    for (i = 0; i < movie.genres.length; i++) {
      movie.genres[i] = movie.genres[i].trim();
      if (typeof movie.genres[i] != "string" || movie.genres[i].length == 0) {
      console.log('in')
        throw "genres should be an array of non-empty strings";
      }
    }

    if (
      Array.isArray(movie.castMembers) !== true &&
      movie.castMembers.length < 1 &&
      movie.castMembers.every(
        (item) =>
          typeof item !== "string" &&
          /^[A-Za-z]+[,.'-]?(?: [A-Z][a-z]+[,.'-]?)*$/.test(item) ===
            false
      )
    ){
      console.log('in')
      throw "castMembers contain only numbers"
    }

    if (
      movie.castMembers.every((item) => {
        const name = item.split(" ");
        const [first, last] = name;
        return first.length < 3 && last.length < 3;
      })
    ){
      console.log('in')
      throw "first name and last name must be grater than 3 characters"
    }


    const [month, day, year] = movie.dateReleased.split("/");
    const dateReleasedCom = new Date(
      +year,
      +month - 1,
      +day
    ).getFullYear();
    //comparison hard coded
    const [months, days, years] = "01/01/1900".split("/");
    const check = new Date(
      +years,
      +months - 1,
      +days
    ).getFullYear();
   
    if (
      !(moment(movie.dateReleased, "MM/DD/YYYY", true).isValid()) &&
      dateReleasedCom < check &&
      dateReleasedCom > new Date().getFullYear() + 2
    ) {
      
      throw "date is not valid format"
    }

    const moviesCollection = await movies();
    await moviesCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: movie }
    );

    return await this.getMovieById(id);
  },
  async removeMovie(id) {
    if (!id) {
      throw "Id is not provide"
      
    }
    if (typeof id !== "string" || id.trim().length === 0) {
      throw "id is not string or id is emty"
      
    }
    if (ObjectId.isValid(id) !== true) {
      throw "id not valid"
    }
    const moviesCollection = await movies();
    const deletionInfo = await moviesCollection.removeOne({
      _id: ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
      throw `could not delete movie with id of ${id}`;
    }
    return { movieId: id, deleted: true };
  },
};

// exportedMethods.getAllmovies()
module.exports = exportedMethods;
