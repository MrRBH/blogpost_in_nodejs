const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String, 
        required: true,
    },
    CoverImage: {
        type: String,
        required: false,
    },
    categories: {
        type: String,
        required: true,
        unique: true
    },
    Tags: {
        type: String,
        required: true
    },
    Active: {
        type: String,
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    likesCount: {
        type: Number,
        default: 0 // Default value for likes count
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

const Blog = model('blog', blogSchema);
module.exports = Blog;
