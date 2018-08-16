const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {

    Post.find({}).then(posts => {

        Category.find({}).then(categories => {

            res.render('home/index', { posts: posts, categories: categories });
        });
    });  
});

router.get('/about', (req, res) => {

    res.render('home/about');
});

router.get('/login', (req, res) => {

    res.render('home/login');
});

router.get('/register', (req, res) => {

    res.render('home/register');
});

router.post('/register', (req, res) => {

    let errors = [];
    if(!req.body.firstName){

        errors.push({message: 'please add a firstname'});
    }

    if(!req.body.lastName){

        errors.push({message: 'please add a lastname'});
    }

    if(!req.body.email){

        errors.push({message: 'please add a email'});
    }

    if(!req.body.password){

        errors.push({message: 'please add a password'});
    }

    if(req.body.password !== req.body.passwordConfirm){

        errors.push({message: 'password field dont match'});
    }

    if(errors.length > 0){

        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })
    }else{

        User.findOne({email: req.body.email}).then(user => {

            if(!user){

                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
            
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                       
                        newUser.password = hash;
                        newUser.save().then(savedUser => {
            
                            req.flash('success_message', `User ${newUser.firstName} was successfully created`);
                            res.redirect('/login');
                        });  
                    });
                });
            } else {

                req.flash('error_message', `User already exists`);
                res.redirect('/register');
            }
        });
    }   
});

router.get('/post/:id', (req, res) => {

    Post.findOne({_id: req.params.id})
        .then(post => {
            
            Category.find({}).then(categories => {
            res.render('home/post', {post: post, categories:categories});
        });
    });
});


module.exports = router;