'use strict'

const utils = require('../utils/writer.js')
const Number = require('../service/NumberService')
const { FIXED_START_NUM, FIXED_MAX_NUM } = require('../utils/constants')

const isValidPhoneNumber = n =>
  typeof n === 'number' && n >= FIXED_START_NUM && n <= FIXED_MAX_NUM

module.exports.checkNumber = function checkNumber(req, res) {
  const specifiedNumber = req.swagger.params['specifiedNumber'].value
  if (isValidPhoneNumber(specifiedNumber)) {
    Number.checkNumber(specifiedNumber)
      .then(response => utils.writeJson(res, response))
      .catch(response => utils.writeJson(res, response))
  } else {
    utils.writeJson(
      res,
      utils.respondWithCode(400, { msg: 'Invalid number format' })
    )
  }
}

module.exports.restoreNumber = function restoreNumber(req, res) {
  const specifiedNumber = req.swagger.params['specifiedNumber'].value
  if (isValidPhoneNumber(specifiedNumber)) {
    Number.restoreNumber(specifiedNumber)
      .then(response => utils.writeJson(res, response))
      .catch(response => utils.writeJson(res, response))
  } else {
    utils.writeJson(
      res,
      utils.respondWithCode(400, { msg: 'Invalid number format' })
    )
  }
}

module.exports.takeNumber = function takeNumber(req, res) {
  const random = req.swagger.params['random'].value.random || false
  Number.takeNumber(random)
    .then(response => utils.writeJson(res, response))
    .catch(response => utils.writeJson(res, response))
}

module.exports.takeSpecifiedNumber = function takeSpecifiedNumber(req, res) {
  const specifiedNumber = req.swagger.params['specifiedNumber'].value

  if (isValidPhoneNumber(specifiedNumber)) {
    Number.takeSpecifiedNumber(specifiedNumber)
      .then(response => utils.writeJson(res, response))
      .catch(response => utils.writeJson(res, response))
  } else {
    utils.writeJson(
      res,
      utils.respondWithCode(400, { msg: 'Invalid number format' })
    )
  }
}
