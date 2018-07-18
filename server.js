const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


var app = express(); //calling express to take over

hbs.registerPartials(__dirname + '/views/partials'); //registering partilas ex: footer, header
app.set('view engine', 'hbs');//setting handelbars as view engine


//registering a helper to get current year.
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear()
});

//registering a helper to make text uppercase.
hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase()
});

//creating a middleware to log server requests
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    fs.appendFile('server.log', log+'\n', (err)=>{
        if(err){
            console.log('Cannot appent file.');
        }
    });
    console.log(log);
    next();//this has to call right after the function to continue the application.
});


//creating a maintenance middleware to show viewers site is under construction.
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));//using a middlware to access absolute path (this should be placed at the bottom of all other middlewares)



app.get('/', (req, res)=>{//forwarding a GET request (Routing)
    // res.send('<h1>Hello from Express</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage : 'Welcome to the Some Web Site'
    });
});

app.get('/about', (req, res)=>{
    // res.render('about');
    res.send({
        myself : 'Yazhodha',
        age : 25,
        hobbies : [
            'play cricket',
            'making subtitles',
            'coding'
            
        ]
    });
});

app.get('/bad', (req, res)=>{
    res.send({
        error : {
            status : 'Page Not Found !',
            code : 404
        }
    });
});

app.get('/contact', (req, res)=>{
    res.render('contact.hbs', {
        pageTitle : 'Contact Page'
    });
});

app.listen(3000, ()=>{
    console.log('Server started on PORT 3000');
});