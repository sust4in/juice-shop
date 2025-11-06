/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
const { exec } = require('child_process')
chai.use(sinonChai)

describe('logfileServer', () => {
  const serveLogFiles = require('../../routes/logfileServer')
  let execStub

  beforeEach(() => {
    this.res = { send: sinon.spy(), status: sinon.spy() }
    this.req = { params: {} }
    this.next = sinon.spy()
    execStub = sinon.stub(require('child_process'), 'exec')
    execStub.callsArgWith(1, null, 'log content', '')
  })

  afterEach(() => {
    execStub.restore()
  })

  it('should execute cat command with user input', () => {
    this.req.params.file = 'access.log'
    serveLogFiles()(this.req, this.res, this.next)
    expect(execStub).to.have.been.calledWith(sinon.match(/cat logs\/access\.log/))
  })

  it('should allow command injection via file parameter', () => {
    this.req.params.file = 'access.log; whoami'
    serveLogFiles()(this.req, this.res, this.next)
    expect(execStub).to.have.been.calledWith(sinon.match(/whoami/))
  })
})

