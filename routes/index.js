const router = require('express').Router();
const Projects = require('../models/Projects.js');

router.get('/', (req, res, next) => {
  res.status(200).json({ msg: 'Working' });
});

router.get('/projects', (req,res,next) => {
  
  Projects.find()
    .then(projResults => res.json(projResults))
    .catch(err => next(err));
})

router.get('/projects/:id', (req,res,next) => {
  const {id} = req.params;
  Projects.findById(id)
    .then(projResult => res.json(projResult))
    .catch(err => next(err));
  })

router.post('/projects', (req,res,next) => {
  const {title, description, link, img, img_large} = req.body;
  Projects.create({title, description, link, img, img_large })
    .then(projectDoc => res.json(projectDoc))
    .catch(err => {
      console.log('there is an error in projects post req');
      next(err);
    })
})

router.post('/projects/:id', (req,res,next) => {
  const {id} = req.params;
  const {title, description, link, img, img_large} = req.body;
  Projects.findByIdAndUpdate(id, {title, description, link, img, img_large})
    .then(projResult => res.json(projResult))
    .catch(err=> console.log('UPDATING ERROR', err))
})


module.exports = router;
