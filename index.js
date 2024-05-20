const express = require('express');
const path = require('path'); // Require path for path.resolve
const userRouter = require("./routes/user");
const { default: mongoose } = require('mongoose');
const e = require('express');
const app = express();
const PORT = 4000;

//connection
mongoose.connect("mongodb://127.0.0.1:27017/RB-blogs").then(e=>console.log('mongo db connected'));
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views')); // Correct the views directory setting
app.use('/user/',userRouter);
app.get('/', (req, res) => {
    res.render('home');
});

app.listen(PORT, () => { // Corrected app.listen and the callback function
    console.log(`Server started at port: ${PORT}`);
});
