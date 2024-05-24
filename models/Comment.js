const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },blogId:{
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
}, { timestamps: true });
const Comment = model('Comment', CommentSchema);
module.exports = Comment;
