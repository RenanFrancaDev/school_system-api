import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import Classroom from '#models/classroom'
import { createClassroomSchema, updateClassroomSchema } from '../schemas/classrooms_schemas.js'
import Allocation from '#models/allocation'

export default class ClassroomsController {
  /**
   * Get all classrooms (with pagination and filters)
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const isAvailable = request.input('is_available')

    const classroomsQuery = Classroom.query().preload('teacher')

    // Filter by availability if provided
    if (isAvailable !== undefined) {
      classroomsQuery.where('is_available', isAvailable === 'true')
    }

    const classrooms = await classroomsQuery.orderBy('created_at', 'desc').paginate(page, limit)

    return response.ok(classrooms)
  }

  /**
   * Get specific classroom by ID
   */
  async show({ params, response }: HttpContext) {
    const classroom = await Classroom.query()
      .where('id', params.id)
      .preload('teacher')
      .firstOrFail()

    return response.ok({
      classroom: classroom.serialize(),
    })
  }

  /**
   * Create new classroom (only teachers)
   */
  async store({ request, response }: HttpContext) {
    const teacher = request.user!

    // Check if user is a teacher
    if (teacher.type !== 'teacher') {
      return response.forbidden({
        error: 'Only teachers can create classrooms',
      })
    }

    // Validate input data
    const data = await request.validate({ schema: createClassroomSchema })

    const classroom = await Classroom.create({
      id: randomUUID(), // ← ADICIONAR UUID AQUI
      ...data,
      teacherId: teacher.id,
      isAvailable: true,
    })

    await classroom.load('teacher')

    return response.created({
      message: 'Classroom created successfully',
      classroom: classroom.serialize(),
    })
  }

  //Update classroom (only owner teacher)

  async update({ params, request, response }: HttpContext) {
    const teacher = request.user!
    const classroom = await Classroom.find(params.id)
    if (!classroom) {
      return response.notFound('Classroom not found')
    }

    // Check if user is the classroom owner
    if (classroom.teacherId !== teacher.id) {
      return response.forbidden({
        error: 'You can only update your own classrooms',
      })
    }

    // Validate input data
    const data = await request.validate({ schema: updateClassroomSchema })

    // Manual check for unique name (if name is being updated)
    if (data.name && data.name !== classroom.name) {
      const existingClassroom = await Classroom.findBy('name', data.name)
      if (existingClassroom) {
        return response.badRequest({
          error: 'Classroom name already in use',
        })
      }
    }

    classroom.merge(data)
    await classroom.save()
    await classroom.load('teacher')

    return response.ok({
      message: 'Classroom updated successfully',
      classroom: classroom.serialize(),
    })
  }

  // Delete classroom (only owner teacher)

  async destroy({ params, request, response }: HttpContext) {
    const teacher = request.user!
    const classroom = await Classroom.find(params.id)
    if (!classroom) {
      return response.notFound('Classroom not found')
    }

    // Check if user is the classroom owner
    if (classroom.teacherId !== teacher.id) {
      return response.forbidden({
        error: 'You can only delete your own classrooms',
      })
    }

    await classroom.delete()

    return response.ok({
      message: 'Classroom deleted successfully',
    })
  }

  //Get all students in a classroom

  async students({ params, response }: HttpContext) {
    const classroom = await Classroom.find(params.id)
    if (!classroom) {
      return response.notFound('Classroom not found')
    }

    const students = await Allocation.query()
      .where('classroom_id', params.id)
      .preload('student')
      .select('student_id')

    const studentList = students.map((allocation) => allocation.student.serialize())

    return response.ok({
      classroom: classroom.name,
      students: studentList,
    })
  }
}
