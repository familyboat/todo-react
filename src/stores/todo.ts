import {
  addTodoToDb,
  editTaskInTodoInDb,
  getAllTodosFromDb,
  markTodoAsCreatedInDb,
  markTodoAsDeletedInDb,
  markTodoAsDoneInDb,
} from '@/db/todo'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

/**
 * 日期的字符串形式，时区用 UTC。
 */
type DateString = string

export const TodoStatus = {
  /**
   * 已创建
   */
  created: 0,
  /**
   * 已完成
   */
  done: 1,
  /**
   * 已删除
   */
  deleted: 2,
} as const

export type TodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus]

/**
 * 对 UTC 值序列化
 */
export function serializeUTC(utc: string) {
  return new Date(utc).toLocaleString()
}

/**
 * 标明 todo 的状态是否为：已完成
 */
export function isDone(todo: Todo) {
  return todo.status === TodoStatus.done
}

/**
 * 标明 todo 的状态是否为：已删除
 */
export function isDeleted(todo: Todo) {
  return todo.status === TodoStatus.deleted
}

/**
 * 标明 todo 的状态是否为：已创建
 */
export function isCreated(todo: Todo) {
  return todo.status === TodoStatus.created
}

/**
 * 描述 todo 的属性结构
 */
export interface Todo {
  /**
   * 待处理的任务
   */
  task: string
  /**
   * 标明该任务的状态：已创建、已完成、已删除
   *
   * 以下状态变化是合理的：
   * 1. 已创建 -> 已完成
   * 2. 已创建 -> 已删除
   * 3. 已完成 -> 已删除
   */
  status: TodoStatus
  /**
   * 任务创建的时间
   */
  createdAt: DateString
  /**
   * 任务修改的时间
   *
   * 已完成或已删除的任务不可修改
   */
  modifiedAt: DateString
  /**
   * 任务的唯一编号
   */
  uuid: string
}

export const useTodosStore = create(
  immer(
    combine({ todos: Array.from<Todo>([]) }, (set, get) => {
      return {
        createTodoFrom(task: string) {
          set((state) => {
            if (task === '') return

            const now = new Date()

            const todo: Todo = {
              task,
              status: TodoStatus.created,
              createdAt: now.toUTCString(),
              modifiedAt: now.toUTCString(),
              uuid: crypto.randomUUID(),
            }

            state.todos.push(todo)
            addTodoToDb(todo)
          })
        },
        editTaskInTodo(uuid: string, task: string) {
          set((state) => {
            const target = state.todos.find((todo) => todo.uuid === uuid)
            if (target) {
              const now = new Date()
              target.task = task
              target.modifiedAt = now.toUTCString()
              editTaskInTodoInDb(uuid, task, now.toUTCString())
            }
          })
        },
        markTodoAsDone(uuid: string) {
          set((state) => {
            const target = state.todos.find((todo) => todo.uuid === uuid)
            if (target) {
              target.status = TodoStatus.done
              markTodoAsDoneInDb(uuid)
            }
          })
        },
        markTodoAsDeleted(uuid: string) {
          set((state) => {
            const target = state.todos.find((todo) => todo.uuid === uuid)
            if (target) {
              target.status = TodoStatus.deleted
              markTodoAsDeletedInDb(uuid)
            }
          })
        },
        markTodoAsCreated(uuid: string) {
          set((state) => {
            const target = state.todos.find((todo) => todo.uuid === uuid)
            if (target) {
              target.status = TodoStatus.created
              markTodoAsCreatedInDb(uuid)
            }
          })
        },
        async loadFromDb() {
          const _todoList = await getAllTodosFromDb()
          set(() => ({
            todos: _todoList,
          }))
        },
        getCreatedTodos() {
          const todos = get().todos
          return todos.filter((todo) => isCreated(todo))
        },
        getDoneTodos() {
          const todos = get().todos
          return todos.filter((todo) => isDone(todo))
        },
        getDeletedTodos() {
          const todos = get().todos
          return todos.filter((todo) => isDeleted(todo))
        },
      }
    })
  )
)
