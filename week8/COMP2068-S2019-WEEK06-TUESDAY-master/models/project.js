const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  teacher: String,
  courseCode: String,
  title: String
});

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  class: classSchema
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
