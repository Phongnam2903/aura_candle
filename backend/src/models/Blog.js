const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    images: [{ type: String }],
    link: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ isPublished: 1, createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema, "blogs");
module.exports = Blog;
