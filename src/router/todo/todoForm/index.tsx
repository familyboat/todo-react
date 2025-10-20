import { useTodosStore } from '@/stores/todo'
import { useState } from 'react'
import styles from './index.module.css'

export default function TodoForm() {
  const [task, setTask] = useState('')
  const createTodoFrom = useTodosStore((state) => state.createTodoFrom)

  function createTodo() {
    if (task) {
      createTodoFrom(task)
      setTask('')
    }
  }

  return (
    <>
      <div className={styles.form}>
        <input
          type="text"
          placeholder="请输入任务内容"
          value={task}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value
            setTask(value)
          }}
        />
        <button type="button" onClick={createTodo}>
          创建
        </button>
      </div>
    </>
  )
}
