import { useTodosStore } from '@/stores/todo'
import { useEffect } from 'react'
import styles from './index.module.css'
import TodoItem from '../todoItem'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function TodoList() {
  useTodosStore((state) => state.todos)
  const loadFromDb = useTodosStore((state) => state.loadFromDb)
  const getCreatedTodos = useTodosStore((state) => state.getCreatedTodos)
  const getDoneTodos = useTodosStore((state) => state.getDoneTodos)
  const getDeletedTodos = useTodosStore((state) => state.getDeletedTodos)

  const [parent] = useAutoAnimate()

  useEffect(() => {
    loadFromDb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className={styles.list} ref={parent}>
        <header key="created">已创建</header>
        {getCreatedTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
        <hr key="created-hr" />

        <header key="done">已完成</header>
        {getDoneTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
        <hr key="done-hr" />

        <header key="deleted">已删除</header>
        {getDeletedTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
      </div>
    </>
  )
}
