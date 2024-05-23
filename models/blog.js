const { Schema, model } = require('mongoose');
const { schema } = require('./user');
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,

    }, CoverImage: {
        type: String,
        required: false,
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });
const Blog = model('blog', blogSchema);
module.exports = Blog;
