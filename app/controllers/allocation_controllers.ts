import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import Allocation from '#models/allocation'
import Classroom from '#models/classroom'
import User from '#models/user'

export default class AllocationsController {
  async store({ request, response }: HttpContext) {
    const teacher = request.user!

    // Check if user is a teacher (RF13)
    if (teacher.type !== 'teacher') {
      return response.forbidden({
        error: 'Only teachers can allocate students',
      })
    }

    const { studentId, classroomId } = request.only(['studentId', 'classroomId'])

    // Get classroom and check ownership (RN05)
    const classroom = await Classroom.find(classroomId)
    if (!classroom) {
      return response.notFound('Classroom not found')
    }
    if (classroom.teacherId !== teacher.id) {
      return response.forbidden({
        error: 'You can only allocate students to your own classrooms',
      })
    }

    // Check if classroom is available
    if (!classroom.isAvailable) {
      return response.badRequest({
        error: 'Classroom is not available for allocations',
      })
    }

    // Check if student exists and is actually a student
    const student = await User.find(studentId)
    if (!student) {
      return response.notFound('Student not found')
    }
    if (student.type !== 'student') {
      return response.badRequest({
        error: 'Can only allocate students to classrooms',
      })
    }

    // RN03: Check if student is already allocated to any classroom
    const existingAllocation = await Allocation.findBy('student_id', studentId)
    if (existingAllocation) {
      return response.badRequest({
        error: 'Student is already allocated to a classroom',
      })
    }

    // Check classroom capacity
    const currentAllocations = await Allocation.query()
      .where('classroom_id', classroomId)
      .count('* as total')

    const currentCount = Number(currentAllocations[0].$extras.total)
    if (currentCount >= classroom.capacity) {
      return response.badRequest({
        error: 'Classroom has reached maximum capacity',
      })
    }

    // Create allocation
    const allocation = await Allocation.create({
      id: randomUUID(),
      studentId: studentId,
      classroomId: classroomId,
      teacherId: teacher.id,
    })

    await allocation.load('student')
    await allocation.load('classroom')
    await allocation.load('teacher')

    return response.created({
      message: 'Student allocated successfully',
      allocation: allocation.serialize(),
    })
  }

  //Remove student from classroom

  async destroy({ params, request, response }: HttpContext) {
    const teacher = request.user!

    // Check if user is a teacher
    if (teacher.type !== 'teacher') {
      return response.forbidden({
        error: 'Only teachers can remove students from classrooms',
      })
    }

    const allocation = await Allocation.find(params.id)
    if (!allocation) {
      return response.notFound('Allocation not found')
    }

    // Check if teacher owns the classroom
    const classroom = await Classroom.find(allocation.classroomId)
    if (!classroom) {
      return response.notFound('Classroom not found')
    }
    if (classroom.teacherId !== teacher.id) {
      return response.forbidden({
        error: 'You can only remove students from your own classrooms',
      })
    }

    await allocation.delete()

    return response.ok({
      message: 'Student removed from classroom successfully',
    })
  }
}
