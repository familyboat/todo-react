import {
  isCreated,
  isDeleted,
  isDone,
  serializeUTC,
  useTodosStore,
  type Todo,
} from '@/stores/todo'
import { useState } from 'react'
import styles from './index.module.css'
import clsx from 'clsx'

type TodoItemType = {
  index: number
  todo: Todo
}

export default function TodoItem(props: TodoItemType) {
  const markTodoAsDone = useTodosStore((state) => state.markTodoAsDone)
  const markTodoAsCreated = useTodosStore((state) => state.markTodoAsCreated)
  const markTodoAsDeleted = useTodosStore((state) => state.markTodoAsDeleted)
  const editTaskInTodo = useTodosStore((state) => state.editTaskInTodo)

  const [task, setTask] = useState(props.todo.task)
  const [isEditing, setEditing] = useState(false)

  function flipEditingStatus() {
    setEditing(!isEditing)
    if (isEditing === true && task !== props.todo.task) {
      editTaskInTodo(props.todo.uuid, task)
    }
  }

  return (
    <>
      <li className={styles.item}>
        <span>{props.index}</span>
        {!isEditing ? (
          <span
            className={clsx({
              [styles.done]: isDone(props.todo),
              [styles.deleted]: isDeleted(props.todo),
            })}
          >
            {props.todo.task}
          </span>
        ) : (
          <input
            type="text"
            value={task}
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              setTask(target.value)
            }}
          />
        )}
        <span>创建于 {serializeUTC(props.todo.createdAt)}</span>
        {isCreated(props.todo) && !isEditing && (
          <>
            <button
              type="button"
              onClick={() => {
                markTodoAsDone(props.todo.uuid)
              }}
            >
              完成
            </button>
            <button
              type="button"
              onClick={() => {
                markTodoAsDeleted(props.todo.uuid)
              }}
            >
              删除
            </button>
          </>
        )}
        {!isCreated(props.todo) && (
          <button
            type="button"
            onClick={() => {
              markTodoAsCreated(props.todo.uuid)
            }}
          >
            回退
          </button>
        )}
        {isCreated(props.todo) && (
          <button type="button" onClick={flipEditingStatus}>
            {isEditing ? '确认' : '编辑'}
          </button>
        )}
      </li>
    </>
  )
}
