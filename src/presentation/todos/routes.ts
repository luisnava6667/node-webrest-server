import { Router } from 'express'
import { TodosControllers } from './controller'

export class TodoRoutes {
  static get routes(): Router {
    const router = Router()
    const todoControllers = new TodosControllers()
    router.get('/', todoControllers.getTodos)
    router.get('/:id', todoControllers.getTodoById)
    
    router.post('/', todoControllers.createTodo)
    router.put('/:id', todoControllers.updateTodo)
    router.delete('/:id', todoControllers.deleteTodo)
    return router
  }
}
