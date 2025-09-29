import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserSchema } from '../schemas/user_schemas.js'

export default class UsersController {
  //Get all users (with pagination)
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query().orderBy('created_at', 'desc').paginate(page, limit)

    return response.ok(users)
  }

  //Get id user
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return response.ok({
      user: user.serialize(),
    })
  }

  //Update user (users can only update themselves)
  async update({ params, request, response }: HttpContext) {
    const authenticatedUser = request.user!
    const userToUpdate = await User.findOrFail(params.id)

    // Check if user is updating themselves
    if (authenticatedUser.id !== userToUpdate.id) {
      return response.forbidden({
        error: 'You can only update your own profile',
      })
    }

    // Validate input data using schema
    const data = await request.validate({ schema: updateUserSchema })

    // email uniqueness check
    if (data.email && data.email !== userToUpdate.email) {
      const existingUser = await User.findBy('email', data.email)
      if (existingUser && existingUser.id !== userToUpdate.id) {
        return response.badRequest({
          error: 'Email already in use',
        })
      }
    }

    userToUpdate.merge(data)
    await userToUpdate.save()

    return response.ok({
      message: 'User updated successfully',
      user: userToUpdate.serialize(),
    })
  }

  // Delete user (users can only delete themselves)

  async destroy({ params, request, response }: HttpContext) {
    const authenticatedUser = request.user!
    const userToDelete = await User.findOrFail(params.id)

    // Check if user is deleting themselves
    if (authenticatedUser.id !== userToDelete.id) {
      return response.forbidden({
        error: 'You can only delete your own account',
      })
    }

    await userToDelete.delete()

    return response.ok({
      message: 'User deleted successfully',
    })
  }
}
