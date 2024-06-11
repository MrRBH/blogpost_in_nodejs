// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
  