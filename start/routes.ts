import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
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
  })
  .prefix('/api')
