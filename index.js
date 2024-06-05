require("dotenv").config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");
const { configDotenv } = require("dotenv");

const app = express();
const PORT = process.env.PORT|| 4000;

// Connect to MongoDB
mongoose.connect( process.env.MONGO_URL)
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
app.get('/', async(req, res) => {
  const allblog = await Blog.find({})
  res.render('home', { user: req.user,blogs:allblog } );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
}); 
