// profile.js

 const express = require('express');
const path = require('path');
const fs = require('fs');

 const app = express();
const PORT = 3000;

 app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/public'));

 app.get('/profile', function(req, res) {
     let id = req.query.id;
    
    const titleData = fs.readFileSync(path.join(__dirname, 'private', id, 'title.txt'), 'utf8');
    const bioData = fs.readFileSync(path.join(__dirname, 'private', id, 'bio.txt'), 'utf8');
    const reviewsData = fs.readFileSync(path.join(__dirname, 'private', id, 'reviews', 'text01.txt'), 'utf8');

     //  code that sends data to the EJS template
     res.render('profile', {
        id: id,

        titleData: titleData,
        bioData: bioData,
        reviewsData: reviewsData,
         
    });
});

// http://localhost:3000/profile?id=jessy

// Start the server
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
