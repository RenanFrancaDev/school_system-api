import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
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
      })
      .middleware([middleware.jwtAuth()])
  })
  .prefix('/api')
