const express = require('express'); //first step importing the express module
const hbs = require('hbs');
const fs = require('fs');
var app = express();// second step is to make an express app

hbs.registerPartials(__dirname+'/views/partials'); // this for adding partials -- which is same piece of template that is
//going to reappear in all your views for e.g. the footer and the header.
//the partials view is created in the views folder.
/*-------------------------------------------------------------------------------------------------*/


//this lets us set some various express related configurations
//set has a key value pair -- key we are using is view engine and value is hbs
//this is gonna let express know that the view engine we are using is hbs
app.set('view engine','hbs');

//-------------------------------------------------Extended use of middleware-----------------------------------------//

//app.use takes a function as an argument. Here below we are passinga simple function which takes two arguments
//req and res are familiar. Next is an argument that is used to specify what to do next once your middleware is done.
//In the below middleware if we never call next(); the below get requests wont be executed because server does not know
//what to do next. It will connect to the server but never serve it unless next(); is called
app.use((req,res,next)=>{
 //creating a logger to log all requests to server, the method used for request and the url used for request
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  //for logging all the requests in a file
  //for node version 7 or greater you need to provide an error function too to handle the error
  //fs.appendFile('filename',messageToBeAppended, (error)=>{
//         if(error){
//           console.log('Unable to append file');
//         }
// })
  fs.appendFile('server.log',log+'\n');
  // for logging all the requests on the terminal
  console.log(log);
next();
});

//----maintenance middleware challenge-----//
// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
// })

//middleware to serve help.html setting up a static directory
app.use(express.static(__dirname+'/public'));
//-----------------------Use of A Helper-------------------------------------------------------------------//
//hbs partial helper to remove the need of calling a function again and again for our case Date().getFullYear()
//using this we can remove the currentYear input that we are passing at two places instead we can use
//the getCurrentYear helper in our footer directly
//registerHelper takes two arguments one is sthe name of the helper and the second is a function which returns a value
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});


//second helper to capitalize titles or words that are required anywhere in the template
hbs.registerHelper('screamIt',(text)=>{
      return text.toUpperCase();
});


//-------------------------------------------for handling http get request-----------------------------------------//
//app.get takes two arguments first is the url of the request and the secons is a handler which takes two paramenters req and res
app.get('/',(req,res)=>{
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Prateek',
  //   likes : [
  //     'Coding',
  //     'Dancing',
  //     'Cooking'
  //   ]
  // });

  res.render('home.hbs',{
    pageTitle : 'Home Page',
    welcomeMessage : 'Welcome to a new world of node based servers.'
    // currentYear : new Date().getFullYear()
  })
});
//specifying a new route for a get request for about page using app.get
//we can specify as many routes as required using app.get
app.get('/about',(req,res)=>{
  // res.send('About Page!') --- send is used when we pass a message or an object like a json object or string object
  res.render('about.hbs',{//render is used when you have to render a template from the server in out case about.hbs
    pageTitle : 'About Page'//the second argument in render can be an object that can be injected into the template
    // currentYear : new Date().getFullYear() //fetching the currentYear by using Date JS object
    //now we can inject this
  });
});

//a new challenge


app.get('/bad',(req,res)=>{
  res.send({
    errorMessage : 'Error Handling request'
  });
});
// this binds a port on our machine to our app to listen to the requests
//app.listen does take a second argument and is a function so we can do something while the server is running
// and the output is not served
app.listen(3000, ()=>{
  console.log('Server is up and running at local host 3000');
});
