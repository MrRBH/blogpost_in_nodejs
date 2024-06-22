require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");
const Category = require("./models/categories");
const Comment = require("./models/Comment");
const { error } = require("console");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookie('authToken'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Routes
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.get('/', async (req, res) => {
  let filter = { Active: "Publish" };

  if (req.query.categories) {
    filter.categories = req.query.categories;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i'); // 'i' makes the search case-insensitive
    filter.$or = [
      { title: { $regex: searchRegex } },
      { body: { $regex: searchRegex } }
    ];
  }

  const allblog = await Blog.find(filter);
  let message = null;
  if (allblog.length === 0) {
    message = "Posts Not Found";
  }
  res.render('home', { user: req.user, blogs: allblog, message });
});

app.delete('/blogDelete/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      throw new Error("Invalid ID");
    }
    const deletePost = await Blog.findByIdAndDelete(blogId);
    if (!deletePost) {
      console.log("Post Not Found");
      return res.status(404).send({ msg: "Post Not Found" });
    }
    res.status(200).send({ msg: "Post Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Post Not Deleted" });
  }
});

app.delete("/commentdelete/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found!" });
    }

    res.status(200).send({ msg: "Comment deleted!" });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send({ msg: 'Comment not deleted' });
  }
});

app.patch("/commentUpdate/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    console.log(content);

    // Check if the commentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).send({ msg: "Invalid comment ID!" });
    }

    console.log(`Updating comment with ID: ${commentId} and content: ${content }`);

    // Update the comment using findByIdAndUpdate method
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content :content }
      },
      {
        new: true // This option returns the updated document
      }
    );

    // If the comment is not found, return a 404 response
    if (!updatedComment) {
      return res.status(404).send({ msg: "Comment not found!" });
    }

    console.log(`Updated Comment: ${updatedComment}`);

    // Return a success response with the updated comment
    res.status(200).send({ msg: "Comment updated!", comment: updatedComment });
  } catch (error) {
    console.error('Error updating comment:', error);
    // Return a 500 response if there is an internal server error
    res.status(500).send({ msg: 'Comment not updated' });
  }
});



// Patch route to update a blog post
app.patch("/blogUpdate/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, body } = req.body;

    console.log(title, body);

    // Check if the blogId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ msg: "Invalid blogId!" });
    }

    console.log(`Updating blog post with ID: ${blogId} and content: ${title} : ${body}`);

    // Update the blog post using findByIdAndUpdate method
    const updatedPost = await Blog.findByIdAndUpdate(
      blogId,
      { $set: { title: title, body: body } },
      { new: true }
    );

    // If the blog post is not found, return a 404 response
    if (!updatedPost) {
      return res.status(404).send({ msg: "BlogPost Not Found!" });
    }

    // Return a success response with the updated blog post
    res.status(200).json({ msg: "BlogPost updated!", updatedPost });
  } catch (error) {
    console.error(error);
    // Return a 500 response if there is an internal server error
    res.status(500).send({ msg: "Post Not Updated" });
  }
});
//likes 
// Update likes count (like/unlike)
app.post('/like', async (req, res) => {
  try {
      const { blogId } = req.body;
      if (!blogId) { 
          throw new Error('Blog ID not provided');
      }

      const updatedPost = await Blog.findByIdAndUpdate(
          blogId,
          { $inc: { likesCount: 1 } }, // Increment likesCount
          { new: true }
      );

      if (!updatedPost) {
          throw new Error('Blog post not found');
      }

      res.status(200).json({ msg: 'Post liked', updatedPost });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
  }
});

app.post('/unlike', async (req, res) => {
  try {
      const { blogId } = req.body;
      if (!blogId) {
          throw new Error('Blog ID not provided');
      }

      const updatedPost = await Blog.findByIdAndUpdate(
          blogId,
          { $inc: { likesCount: -1 } }, // Decrement likesCount
          { new: true }
      );

      if (!updatedPost) {
          throw new Error('Blog post not found');
      }

      res.status(200).json({ msg: 'Post unliked', updatedPost });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
  }
});

app.get('/categories', async (req, res) => {
  let filter = { categories: req.query.categories };

  const allblog = await Blog.find(filter);
  res.render('category', { user: req.user, blogs: allblog });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
