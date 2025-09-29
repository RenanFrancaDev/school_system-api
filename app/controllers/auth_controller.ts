import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import { registerUserSchema, loginUserSchema } from '../schemas/user_schemas.js'

export default class AuthController {
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      type: user.type,
    }

    return jwt.sign(payload, process.env.APP_KEY!, {
      expiresIn: '24h',
    })
  }

  async register({ request, response }: HttpContext) {
    // Validate input data using schema
    const data = await request.validate({ schema: registerUserSchema })

    const randomNumbers = Math.floor(10000 + Math.random() * 90000)
    const registration = data.type === 'teacher' ? `T${randomNumbers}` : `S${randomNumbers}`

    const birthDate = DateTime.fromISO(data.birthDate.toString())

    const user = await User.create({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type,
      registration: registration,
      birthDate: birthDate,
    })

    const token = this.generateToken(user)

    return response.created({
      message: 'User created successfully',
      token: token,
    })
  }

  async login({ request, response }: HttpContext) {
    // Validate login data using schema
    const { email, password } = await request.validate({ schema: loginUserSchema })

    const user = await User.verifyCredentials(email, password)
    const token = this.generateToken(user)

    return response.ok({
      message: 'Login successful',
      token: token,
    })
  }

  async me({ request, response }: HttpContext) {
    const user = request.user!
    return response.ok({
      user: user.serialize(),
    })
  }

  async logout({ response }: HttpContext) {
    return response.ok({
      message: 'Logout successful',
    })
  }
}
