'use strict'

const {
  MAX_CAPACITY,
  FIXED_START_NUM,
  FIXED_MAX_NUM
} = require('../utils/constants')
const numbers1 = new Array(MAX_CAPACITY) // 1111111111 to 4111111110
const numbers2 = new Array(MAX_CAPACITY) // 4111111111 to 7111111110
const numbers3 = new Array(MAX_CAPACITY) // 7111111111 to 9999999999
const FIXED_MAX_NUM_POS = FIXED_MAX_NUM - FIXED_START_NUM - 2 * MAX_CAPACITY
const MAX_NUM_1 = FIXED_START_NUM + MAX_CAPACITY - 1
const MAX_NUM_2 = MAX_NUM_1 + MAX_CAPACITY

function isNumOccupied(num) {
  const [, , res] = getNumArrAndPos(num)
  return res || false
}

function occupyNum(num) {
  const [arr, idx] = getNumArrAndPos(num)
  arr[idx] = true
}

function getNumArrAndPos(num) {
  let arr = numbers1
  let pos = num - FIXED_START_NUM
  if (num > MAX_NUM_2) {
    arr = numbers3
    pos -= 2 * MAX_CAPACITY
  } else if (num > MAX_NUM_1) {
    arr = numbers2
    pos -= MAX_CAPACITY
  }
  return [arr, pos, arr[pos]]
}

function numToPhoneStr(num) {
  const digits = String(num).split('')
  const res = []
  for (let i = 0; i < digits.length; i++) {
    res.push(digits[i])
    if (i === 2 || i === 5) res.push('-')
  }
  return res.join('')
}

/**
 * Check whether a number is occupied
 *
 *
 * specifiedNumber Integer Associated number for this lookup
 * returns inline_response_200_1
 **/
const checkNumber = specifiedNumber =>
  new Promise(resolve =>
    resolve({ available: !isNumOccupied(specifiedNumber) })
  )
exports.checkNumber = checkNumber

/**
 * Restore the previous occupied number
 * Restore a number that is occupied previously. Do nothing for available number
 *
 * specifiedNumber Integer Associated number for this lookup
 * returns inline_response_200_2
 **/
exports.restoreNumber = specifiedNumber =>
  new Promise(resolve => {
    const res = isNumOccupied(specifiedNumber)
      ? {
          restored: true
        }
      : {
          reason: 'The number is not occupied.',
          restored: false
        }

    if (res.restored) {
      const [arr, pos] = getNumArrAndPos(specifiedNumber)
      arr[pos] = false
    }
    resolve(res)
  })

/**
 * Take an available number
 *
 *
 * random Boolean Get a random instead of sequential phone number (optional)
 * returns inline_response_200
 **/
const takeNumber = (random, note = '') =>
  new Promise(resolve => {
    let num
    if (random) {
      do {
        const roll = Math.random()
        const arr = roll > 0.66 ? numbers3 : roll > 0.33 ? numbers2 : numbers1
        const baseToAdd =
          roll > 0.66 ? 2 * MAX_CAPACITY : roll > 0.33 ? MAX_CAPACITY : 0
        let index
        do {
          index = Math.floor(Math.random() * MAX_CAPACITY)
        } while (arr === numbers3 && index > FIXED_MAX_NUM_POS)
        num = baseToAdd + index + FIXED_START_NUM
      } while (isNumOccupied(num))
    } else {
      let found = false
      do {
        const roll = Math.random()
        const arr = roll > 0.66 ? numbers3 : roll > 0.33 ? numbers2 : numbers1
        const baseToAdd =
          roll > 0.66 ? 2 * MAX_CAPACITY : roll > 0.33 ? MAX_CAPACITY : 0
        let index = 0
        for (; index < arr.length; index++) {
          if (!isNumOccupied(index + baseToAdd + FIXED_START_NUM)) {
            num = index + baseToAdd + FIXED_START_NUM
            found = true
            break
          }
        }
      } while (!found)
    }
    occupyNum(num)

    const res = {
      success: true,
      number: numToPhoneStr(num)
    }
    if (note) res.note = note
    resolve(res)
  })
exports.takeNumber = takeNumber

/**
 * Specify and take an available number
 *
 *
 * specifiedNumber Integer Associated number for this reservation
 * returns inline_response_200
 **/
exports.takeSpecifiedNumber = specifiedNumber =>
  isNumOccupied(specifiedNumber)
    ? takeNumber(false, "Specified number isn't available")
    : new Promise(resolve => {
        const [arr, pos] = getNumArrAndPos(specifiedNumber)
        arr[pos] = true
        resolve({
          success: true,
          number: numToPhoneStr(specifiedNumber)
        })
      })
