const api = require('../services/api')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { response } = require('express')

module.exports = {
  async index(request, response) {
    //Buscar todos os devs em um raio de 10km e filtrar por tecnologias
    const { latitude, longitude, techs } = request.query

    const techsArray = parseStringAsArray(techs)

    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000
        }
      }
    })

    return response.json(devs)
  }
}
