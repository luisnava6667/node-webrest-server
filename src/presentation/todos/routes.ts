import { Router } from 'express'
import { TodosControllers } from './controller'
import { TodoDatasourceImpl } from '../../infrastructure/datasource/todo.datasource.impl'
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.datasource.impl'

export class TodoRoutes {
  static get routes(): Router {
    const router = Router()
    const datasource = new TodoDatasourceImpl()
    const todoRepository = new TodoRepositoryImpl(datasource)
    const todoControllers = new TodosControllers(todoRepository)
    router.get('/', todoControllers.getTodos)
    router.get('/:id', todoControllers.getTodoById)

    router.post('/', todoControllers.createTodo)
    router.put('/:id', todoControllers.updateTodo)
    router.delete('/:id', todoControllers.deleteTodo)
    return router
  }
}
