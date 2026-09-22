import test from 'node:test'
import assert from 'node:assert/strict'
import { signToken, requireAuth } from '../backend/auth.js'

test('signed session authorizes its owner and rejects tampering', () => {
  const token = signToken({id:7,email:'test@example.invalid',name:'Test'})
  const req={headers:{authorization:`Bearer ${token}`}}
  let next=false
  requireAuth(req,{},()=>{next=true})
  assert.equal(next,true);assert.equal(req.user.id,7)
  let status
  const res={status(code){status=code;return this},json(){return this}}
  requireAuth({headers:{authorization:`Bearer ${token.slice(0,-10)}invalid`}},res,()=>assert.fail('tampered token accepted'))
  assert.equal(status,401)
  requireAuth({headers:{}},res,()=>assert.fail('missing token accepted'))
  assert.equal(status,401)
})
