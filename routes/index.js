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
  const {title, description, link, img } = req.body;
  Projects.create({title, description, link, img })
    .then(projectDoc => res.json(projectDoc))
    .catch(err => {
      console.log('there is an error in projects post req');
      next(err);
    })
})


module.exports = router;
