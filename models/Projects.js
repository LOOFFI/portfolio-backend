const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema ({

  
  title : {type: String, required: true},
  description : {type: String, required: true},
  link : {type: String, required: true},
  img : {type: String, required: true}

},{
  timestamps : true
});

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;