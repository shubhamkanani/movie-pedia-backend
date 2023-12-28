import Movie from "../models/movie.js";
import fs from "fs";

const addOrUpdateMovie = async (payload, fileDetails, id) => {
  try {
    const { title, publishingYear } = payload;
    // const filePath = fileDetails.path;
    let movie = null;

    const dataURI = `data:${
      fileDetails?.mimetype
    };base64,${fileDetails.buffer.toString("base64")}`;

    let movieData = { title, publishingYear, poster: dataURI };
    if (id) {
      movie = await Movie.findOneAndUpdate(
        { _id: id },
        { $set: movieData },
        { new: true }
      );
    } else {
      movie = new Movie(movieData);
      await movie.save();
    }
    return movie;
  } catch (error) {
    throw error;
  }
};

export default {
  getList: async (req, res) => {
    try {
      const page = req.body.page ? parseInt(req.body.page) : 1;
      const limit = req.body.limit ? parseInt(req.body.limit) : 10;
      const name = req.body.name ?? "";
      const publishingYear = req.body.publishingYear ?? [];

      const query = {};
      if (name) {
        query.title = { $regex: new RegExp(name, "i") };
      }
      if (
        publishingYear &&
        Array.isArray(publishingYear) &&
        publishingYear.length > 0
      ) {
        query.publishingYear = { $in: publishingYear };
      }

      const skip = (page - 1) * limit;

      const movies = await Movie.find(query).skip(skip).limit(limit);
      const totalCount = await Movie.countDocuments(query);
      const recordCount = await Movie.countDocuments();

      res.status(200).json({ data: movies, totalCount, recordCount });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the movie list." });
    }
  },
  getMovie: async (req, res) => {
    try {
      const id = req.params.id;

      const movie = await Movie.findOne({ _id: id });
      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      res.status(200).json({ movie: movie });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching the movie.",
      });
    }
  },
  add: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const newMovie = await addOrUpdateMovie(req.body, req.file);

      res
        .status(201)
        .json({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the movie." });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const movie = await addOrUpdateMovie(req.body, req.file, id);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      res
        .status(200)
        .json({ message: "Movie updated successfully", movie: movie });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching/updating the movie.",
      });
    }
  },
  delete: async (req, res) => {
    try {
      const movieId = req.params.id;

      const deletedMovie = await Movie.findByIdAndRemove(movieId);

      if (!deletedMovie) {
        return res.status(404).json({ error: "Movie not found." });
      }

      res
        .status(200)
        .json({ message: "Movie deleted successfully", movie: deletedMovie });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the movie." });
    }
  },
};
