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
  res.render('home', { user: req.user, blogs: allblog, message  , blog:Blog.Tags});
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
