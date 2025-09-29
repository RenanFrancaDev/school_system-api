import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'

router
  .group(() => {
    // Auth routes
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])
    router.get('/auth/me', [AuthController, 'me'])
    router.post('/auth/logout', [AuthController, 'logout'])

    // Health check
    router.get('/', async () => {
      return {
        hello: 'world',
        timestamp: new Date().toISOString(),
      }
    })
  })
  .prefix('/api')
