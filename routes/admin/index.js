const express = require('express');
const router = express.Router();
const POST = require('../../models/Post');
const Category = require('../../models/Category');
const faker = require('faker');
const {userAuth} = require('../../helpers/authen');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next(); 
});

router.get('/', (req, res) => {

    POST.count({}).then(postCount => {
        Category.count({}).then(categoryCount => {
            res.render('admin/index', {postCount: postCount, categoryCount: categoryCount});
        });
    });
});

router.post('/generate-fake-posts', (req, res) => {

    for(let i=0; i<req.body.amount; i++){

        let post = new POST();
        post.file = faker.image.nature();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence;

        post.save(function(err){

            if(err) throw err;
        });
    }
    res.redirect('/admin/posts');
});


module.exports = router;