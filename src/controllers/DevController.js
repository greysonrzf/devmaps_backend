const api = require('../services/api')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
  async index(request, response) {
    const devs = await Dev.find()

    return response.json(devs)
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const apiResponse = await api.get(`/users/${github_username}`)

      const { name = login, avatar_url, bio } = apiResponse.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })

      // Filtrar conexões de acordo com a distancia e tecnologias

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )

      sendMessage(sendSocketMessageTo, 'newDev', dev)
    }

    return response.json(dev)
  }
}