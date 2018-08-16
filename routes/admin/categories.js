const express = require('express');
const router = express.Router();
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const {userAuth} = require('../../helpers/authen');
const Category = require('../../models/Category');
const fs = require('fs');

router.all('/*', userAuth, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next(); 
});

//READ CATEGORIES
router.get('/', (req, res) => {
    Category.find({}).then(categories => {

        res.render('admin/categories/index', {categories: categories});
    }); 
});

//CREATE CATEGORIES
router.post('/create', (req, res) => {

    const newCategory = Category({
        name: req.body.name
    });

    newCategory.save(savedCategory => { 
        req.flash('success_message', `Category successfully created`);
        res.redirect('/admin/categories')        
    }); 
});

//DELETE CATEGORIES
router.delete('/:id', (req, res) => {

    Category.findOne({_id: req.params.id})
    .then(categories =>{

            categories.remove().then(updatedPost => {
            req.flash('success_message', `Category successfully deleted`);
            res.redirect('/admin/categories');
            });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Category.findOne({_id: req.params.id}).then(categories => {
        

        res.render('admin/categories/edit', {categories: categories});
    }); 
});

//UPDATE DATA
router.put('/edit/:id', (req, res) => {

    Category.findOne({_id: req.params.id}).then(categories => {

        categories.name = req.body.name;

        categories.save().then(updatedPost => {

            req.flash('success_message', `Category successfully updated`);
            res.redirect('/admin/categories');
        });
    });   
});
module.exports = router;