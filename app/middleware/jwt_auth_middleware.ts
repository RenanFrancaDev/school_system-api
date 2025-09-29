import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import User from '#models/user'

//configured in controllers
interface JwtPayload {
  sub: string
  type: 'student' | 'teacher'
}

// Extend Request interface to include user
declare module '@adonisjs/core/http' {
  interface Request {
    user?: User
  }
}

export default class JwtAuthMiddleware {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const authHeader = request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized({ error: 'Token not provided' })
    }

    //Remove "Bearer ", let just the token
    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.APP_KEY!) as JwtPayload

      const user = await User.find(decoded.sub)

      if (!user) {
        console.log('AQUI')
        return response.unauthorized({ error: 'Invalid Token [middleware]' })
      }

      //Include user in the request to identify and check yout type
      request.user = user

      await next()
    } catch (error) {
      return response.unauthorized({ error: 'Invalid or expired token' })
    }
  }
}
