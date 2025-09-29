import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserSchema, changePasswordSchema } from '../schemas/user_schemas.js'
import Allocation from '#models/allocation'

export default class UsersController {
  //Get all users (with pagination)

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query().orderBy('created_at', 'desc').paginate(page, limit)

    return response.ok(users)
  }

  //Get user by id
  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({
        message: 'user not found',
      })
    }

    return response.ok({
      user: user.serialize(),
    })
  }

  //Update user (users can only update themselves)
  async update({ params, request, response }: HttpContext) {
    const authenticatedUser = request.user!
    const userToUpdate = await User.find(params.id)
    if (!userToUpdate) {
      return response.notFound('User not found')
    }

    // Check if user is updating themselves
    if (authenticatedUser.id !== userToUpdate.id) {
      return response.forbidden({
        error: 'You can only update your own profile',
      })
    }

    // Validate input data using schema
    const data = await request.validate({ schema: updateUserSchema })

    if (data.name && typeof data.name === 'string') {
      data.name = data.name.trim()
    }

    if (data.email && typeof data.email === 'string') {
      data.email = data.email.trim()
    }

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
    const userToDelete = await User.find(params.id)
    if (!userToDelete) {
      return response.notFound({
        message: 'User not found',
      })
    }

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

  //Get all classrooms for a student RF16 / RN06

  async classrooms({ params, response }: HttpContext) {
    const student = await User.find(params.id)
    if (!student) {
      return response.notFound({
        message: 'Student not found',
      })
    }

    if (student.type !== 'student') {
      return response.badRequest({
        error: 'Only students have classroom allocations',
      })
    }

    const allocation = await Allocation.query()
      .where('student_id', params.id)
      .preload('classroom', (classroomQuery) => {
        classroomQuery.preload('teacher')
      })
      .first()

    if (!allocation) {
      return response.ok({
        student: student.name,
        classrooms: [],
      })
    }

    // RN06: Return student name + array with teacher name and classroom number
    const classroomData = {
      teacherName: allocation.classroom.teacher.name,
      classroomNumber: allocation.classroom.name,
    }

    return response.ok({
      student: student.name,
      classrooms: [classroomData],
    })
  }

  //Change user password

  async changePassword({ request, response }: HttpContext) {
    const authenticatedUser = request.user!

    // Validate input data
    const { currentPassword, newPassword } = await request.validate({
      schema: changePasswordSchema,
    })

    // Verify current password
    try {
      await User.verifyCredentials(authenticatedUser.email, currentPassword)
    } catch {
      return response.badRequest({
        error: 'Current password is incorrect',
      })
    }

    // Update password
    authenticatedUser.password = newPassword
    await authenticatedUser.save()

    return response.ok({
      message: 'Password changed successfully',
    })
  }
}
