/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const { exec } = require('child_process')

module.exports = function serveLogFiles () {
  return ({ params }, res, next) => {
    const file = params.file

    if (!file.includes('/')) {
      exec(`cat logs/${file}`, (error, stdout, stderr) => {
        if (error) {
          res.status(404)
          next(new Error('File not found'))
        } else {
          res.send(stdout)
        }
      })
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }
}
