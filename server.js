var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
var listener = app.listen(8081, function() {
  console.log('Your app is listening on port 8081');
});

var databaseFile = fs.readFileSync(__dirname +'/private/loginDatabase.json', 'utf8');
var login = JSON.parse(databaseFile);

var login = [{email:'shaya.pourani@gmail.com',password:'123'}];

app.post("/myForm", function(request,response){
  var fileContents = fs.readFileSync(__dirname + '/index.html','utf8');
  var password = request.body.password;
  var email = request.body.email;
  
  if(request.body.guest){
    fileContents = fileContents.replace('$hide','hidden');
    fileContents = fileContents.replace('$show','');
  }
  
  if(request.body.logout){
    response.writeHead(302, {
      'Location': 'https://sp-webvrlogin.glitch.me/'
    });
    response.end();
  }
  
  if(request.body.gearvrbtn){
    response.writeHead(302, {
      'Location': 'https://sp-webvr-gearvr.glitch.me/'
    });
    response.end();
  }
  
  if(request.body.desktopbtn){
    response.writeHead(302, {
      'Location': 'https://sp-webvr-deskbuild1.glitch.me/'
    });
    response.end();
  }
  
  if(password == ""){
    fileContents = fileContents.replace('$errorPassword','<br> Please fill the password field!');
    fileContents = fileContents.replace('$errorLogin','');
  }else{
    fileContents = fileContents.replace('$password',password);
  }
  
  if(email == ""){
    fileContents = fileContents.replace('$errorEmail','<br> Please enter a valid email!');
    fileContents = fileContents.replace('$errorLogin','');
  }else{
    fileContents = fileContents.replace('$email',email);
  }
  
  if(request.body.create && password != '' && email != ''){
    login.push({email:email,password:password});
    fileContents = fileContents.replace('$accountCreated',"<br>You are now registered! Press 'Login' to continue");
    fileContents = fileContents.replace('$errorLogin','');
  }
  
  for(var i = 0 ; i < login.length ; i++){
    if(request.body.login && password == login[i].password && email == login[i].email){
      fileContents = fileContents.replace('$hide','hidden')
      fileContents = fileContents.replace('$show','');
    }else{
      fileContents = fileContents.replace('$errorLogin','Entries for email or password are incorrect!');
    }
  }
  
  fileContents = hideCodes(fileContents);
  response.send(fileContents);
  
  fs.writeFile(__dirname +'/private/loginDatabase.json', JSON.stringify(login), function(err) {});
  
});

app.get("/", function (request,response){
  var fileContents = fs.readFileSync(__dirname +'/index.html','utf8');
  fileContents = hideCodes(fileContents);
  response.send(fileContents);

});

function hideCodes(fileContents){
  fileContents = fileContents.replace('$password','');
  fileContents = fileContents.replace('$errorPassword','');
  fileContents = fileContents.replace('$email','');
  fileContents = fileContents.replace('$errorEmail','');
  fileContents = fileContents.replace('$accountCreated','');
  fileContents = fileContents.replace('$errorLogin','');
  fileContents = fileContents.replace('$hide','');
  fileContents = fileContents.replace('$show','hidden');
  return fileContents;
}


