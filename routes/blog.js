const { Router, express } = require("express");
const router = Router();
const path = require('path');
const multer = require('multer');
const Blog = require("../models/blog");
const Comment = require("../models/Comment");
const { cachedDataVersionTag } = require("v8");
const Category = require("../models/categories");
// router.use(express.static(path.resolve("./public/")))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/upload/'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Corrected filename function
    }
});

const upload = multer({ storage });


router.get("/add-new", async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch categories from the database
        res.render("addBlog", { user: req.user, categories }); // Pass categories to the view
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Server Error');
    }
});

router.post("/", upload.single('uploadImage'), async (req, res) => {
    try {
        const { title, body, category } = req.body;
        const blog = new Blog({
            title,
            body,
            userid: req.user._id,
            CoverImage: `upload/${req.file.filename}`,
            Active:req.body.Active,
            categories:req.body.categories,
            Tags:req.body.Tags
        });
        
        await blog.save();
        res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Server Error');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const comments = await Comment.find({ blogId: req.params.id }).populate(
            "userId"
        );
        // console.log(blog);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.render('viewblog', { user: req.user, blog, comments }); // Pass a single blog post
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('Server Error');
    }
});
//Comment routes
router.post("/comment/:blogId", async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            userId: req.user._id,
        });
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).send('Server Error');
    }
});


router.post("/category/:blogId",async(req,res)=>{
    try {
        const category =  await Category.create({
            name:req.body.category,
            blogId:req.params.blogId,
            userId: req.user._id,
        })
      
        res.status(201).send(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Server Error');
    }
});
// router.get('/:category', async (req, res) => {
//     try {
//         const category = req.params.category;
//         const blogs = await Blog.find({ category: category, Active: "Publish" });
//         res.render('home', { user: req.user, blogs: blogs, category: category });
//     } catch (error) {
//         console.error('Error fetching blogs by category:', error);
//         res.status(500).send('Posts Not founds');
//     }
// });


module.exports = router;
