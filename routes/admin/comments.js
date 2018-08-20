const express = require('express');
const router = express.Router(); 
const POST = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next(); 
});

//SHOW COMMENTS
router.get('/', (req, res) => {

    Comment.find({user: req.user.id}).populate('user')
    .then(comments => {
    res.render('admin/comments', {comments: comments});
    });
});

router.post('/', (req, res) => {

    POST.findOne({_id: req.body.id}).then(post => {

        const newComment = new Comment({

            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);
        post.save().then(savedPost => {

            newComment.save().then(savedComment => {

                req.flash('success_message', `Your comment will be Reviewed soon`);
                res.redirect(`/post/${post.id}`);
            });
        });
    });
});

//DELETE DATA
router.delete('/:id', (req, res) => {

    Comment.findOne({_id: req.params.id})
    .then(comments =>{

        POST.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data) => {

            if (err) console.log(err);

            else {
            comments.remove().then(updatedPost => {
            req.flash('success_message', `Comment successfully deleted`);
            res.redirect('/admin/comments');
        });
    }
    });
});
});


//AJAX REQUEST
router.post('/approve-comment', (req, res) => {
     Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result) => {

        if(err) return err;
        
        res.send(result);
     });
    
});

module.exports = router;