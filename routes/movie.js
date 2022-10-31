const express = require("express");
const router = express.Router();
const movieData = require("../data/movie");

// GET /movies 
router.get("/", async (req, res) => {
  try {
    const allMovies = await movieData.getAllMovies();
    let allmoviesList = [];
    for (i = 0; i < allMovies.length; i++) {
      allmoviesList.push({ _id: allMovies[i]._id, title: allMovies[i].title });
    }
    res.json(allmoviesList);
  } catch (e) {
    res.status(500).json({ error: "movies not found" });
  }
});

// POST /movies 
router.post("/", async (req, res) => {
  const movie = req.body;
  
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
    res.status(400).json({ error: "the request body is not valid" });
    return;
  }
  try{
    
    const moviedata = await movieData.createMovie({ ...movie, reviews: [], overallRating:0 });
    res.status(200).json(moviedata);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// GET /movies/id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
  }
  try {
    const movie = await movieData.getMovieById(id);
    res.status(200).json(movie);
  } catch (e) {
    res.status(404).json({ error: "movie by id not found" });
  }
});

// PUT /movies/id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = req.body;
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
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
    res.status(400).json({ error: "the request body is not valid" });
    return;
  }
  
  try {
    await movieData.getMovieById(id);
  } catch (e) {
    res.status(404).json({ error: "movie by id not found" });
    return;
  }
  
  try {
    const updatedmovie = await movieData.updateMovie(id, movie);
    res.status(200).json(updatedmovie);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// PATCH /movies/{id}
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = req.body;
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
    res.status(400).json({ error: "the request body is not valid" });
    return;
  }
  
  try {
    await movieData.getMovieById(id);
  } catch (e) {
    res.status(404).json({ error: "movie by id not found" });
    return;
  }
  
  if (Object.keys(movie).length !== 0) {
    try {
      const updatedmovie = await movieData.updateMovie(id, movie);
      res.status(200).json(updatedmovie);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

// DELETE /movies/{id} 
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  try {
    await movieData.getMovieById(id);
  } catch (e) {
    res.status(404).json({ error: "movie by id not found" });
    return;
  }
  try {
    const deletedmovie = await movieData.removeMovie(id);
    res.status(200).json(deletedmovie);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
