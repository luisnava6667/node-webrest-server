import { TodoEntity } from '../../entities/todo.entity'
import { TodoRepository } from '../../repositories/todo.repositories'

export interface GetTodosUseCase {
  execute(): Promise<TodoEntity[]>
}
export class GetTodos implements GetTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}
  execute(): Promise<TodoEntity[]> {
    return this.repository.getAll()
  }
}
