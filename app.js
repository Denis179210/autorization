const express = require('express');
const app = express();
const port = process.argv[2] || 3005;
const mongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const md5 = require('md5');

mongoose.connect('mongodb://localhost:27017/userDB');

const db = mongoose.connection;

      db.on('error',() => {
        console.err('This user doesn\'t exist', )
      });
      db.once('open', () => {
          console.log('Successful connection )');
      });

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    remember_me: Boolean
});
const User = mongoose.model('User', userSchema);

const tokenSchema = mongoose.Schema({
    value: { type: String, unique: true }
});
const Token = mongoose.model('Token', tokenSchema);

const salt = 'password';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api/get-browser-refresh-url', (req, res) => {
    console.log('Well', process.env.BROWSER_REFRESH_URL);
    res.send(process.env.BROWSER_REFRESH_URL);
})

app.use('/*', (req, res, next) => {
    Token.find({ token: req.headers.authorization}, (err, data) => {
        if(err) {
            console.log(err)
        } else if(data.length == 0) {
            res.redirect('/sing_up');
        } else {
            next();
        }
    })
})


app.post('/sign_in', (req, res) => {
    
    console.log(req.headers);

    User.find({password: md5(req.body.password + salt)}, (err, data) => {
        if(data.length == 0 ) {
            console.log('Not found');
            res.sendStatus(404);
        } else {

            let token = md5(Date.now());
                new Token({value: token})
                        .save()
                        .then((res) => {
                            console.log(res);
                        });
            if(req.body.remember_me) {
                res.json({
                    token: token,
                    insertLogOut: true,
                    remember_me: true
                })    
            } else {
                res.json({
                    token: token,
                    insertLogOut: true,
                    remember_me: false
                })   
            }
            
        }
    })
})

app.post('/sign_up', (req, res) => {
    console.log(req.body);
    req.body.password = md5(req.body.password + salt);
    new User(req.body).save()
        .then(() => {

            let token = md5(Date.now());
            new Token({value: token}).save().then((res) => {
                console.log(res);
            });
            if(req.body.remember_me) {
                res.json({
                    token: token,
                    remember_me: true
                })    
            } else {
                res.json({
                    token: token,
                    remember_me: false
                })   
            }
        })
})



app.get('/token', (req, res) => {

    Token.remove({ value: req.headers.authorization}, (err) => {
        if(!err) {
            console.log('Document removed :')
            res.end()
        } else {
            console.error(err)
        }
    })
})


app.get('/test', (req, res) => {
    console.log(req.headers);
    Token.find({}, (err, data) => {
        if(err) {
            console.error(err)
            res.sendStatus(500);
        } else if(data.length == 0 ) {
            console.log('Not found');
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    })
})

app.get('/*', (req, res) => {

    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(port, (err) => {
    if(err) {
        console.error(err)
    }
    console.log(`Listen on port ${port}`);
    if (process.send) {
        process.send({ event:'online', url:`http://localhost:${port}/` });
    }
})

