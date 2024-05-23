const { Router ,express} = require("express");
const router = Router();
const path = require('path');
const multer = require('multer');
const Blog = require("../models/blog");
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

router.get("/add-new", (req, res) => {
    return res.render("addBlog", { user: req.user });
});

router.post("/", upload.single('uploadImage'), async(req, res) => {
    console.log(req.body);
    console.log(req.file); // Log file info to ensure it's uploaded
    // Process form data and handle uploaded file here
    const {title,body}= req.body;
    const blog = await Blog.create({
        body,title,userid:req.user._id,CoverImage:`upload/${req.file.filename}`

    })
    res.redirect(`blog/${blog._id}`);
});
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        console.log(blog);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.render('viewblog', { user: req.user, blog }); // Pass a single blog post
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
