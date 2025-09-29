import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
import ClassroomsController from '#controllers/classrooms_controller'
import AllocationsController from '#controllers/allocation_controllers'
import { middleware } from './kernel.js'

router
  .group(() => {
    // Public routes
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])

    // Protected routes
    router
      .group(() => {
        router.get('/auth/me', [AuthController, 'me'])
        router.post('/auth/logout', [AuthController, 'logout'])
      })
      .middleware([middleware.jwtAuth()])

    // Users Routes
    router
      .group(() => {
        router.get('users', [UsersController, 'index'])
        router.get('users/:id', [UsersController, 'show'])
        router.put('users/:id', [UsersController, 'update']) // Can only update own profile
        router.delete('users/:id', [UsersController, 'destroy']) // Can only delete own account
        router.get('/users/:id/classrooms', [UsersController, 'classrooms'])
        router.put('/users/password', [UsersController, 'changePassword'])
      })
      .middleware([middleware.jwtAuth()])

    //Classrooms Routes
    router
      .group(() => {
        router.get('/classrooms', [ClassroomsController, 'index'])
        router.get('/classrooms/:id', [ClassroomsController, 'show'])
        router.post('/classrooms', [ClassroomsController, 'store'])
        router.put('/classrooms/:id', [ClassroomsController, 'update']) // Can only delete own classroom
        router.delete('/classrooms/:id', [ClassroomsController, 'destroy']) // Can only delete own classroom
        router.get('/classrooms/:id/students', [ClassroomsController, 'students']) // show students in the classsroom RF15
      })
      .middleware([middleware.jwtAuth()])

    //Allocations Routes
    router
      .group(() => {
        router.post('/allocations', [AllocationsController, 'store']) // All the alocations RF13
        router.delete('/allocations/:id', [AllocationsController, 'destroy']) // specific allocation RF14
      })
      .middleware([middleware.jwtAuth()])
  })
  .prefix('/api')
