// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema, "blogs");
module.exports = Blog;