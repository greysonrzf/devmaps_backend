const { Schema, model } = require('mongoose');
const PointSchema = require('./utils/PointSchema')

const DevSchema = new Schema({
  name: {
    type: String,
  },
  github_username: {
    type: String,
    required: true,
  },
  bio: String,
  avatar_url: {
    type: String,
  },
  techs: [String],
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
}, {
  timestamps: true
})

module.exports = model('Dev', DevSchema)