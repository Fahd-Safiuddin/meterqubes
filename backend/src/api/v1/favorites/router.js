import Router from 'koa-router'
import * as favoritesController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/', authMiddleware, favoritesController.getUserFavorites)
  .put('/:marketId', authMiddleware, favoritesController.updateUserFavorites)
  .delete('/:marketId', authMiddleware, favoritesController.deleteUserFavorites)

export default router.routes()
