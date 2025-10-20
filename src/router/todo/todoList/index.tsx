import { useTodosStore } from '@/stores/todo'
import { useEffect } from 'react'
import styles from './index.module.css'
import TodoItem from '../todoItem'
import * as motion from 'motion/react-client'

export default function TodoList() {
  useTodosStore((state) => state.todos)
  const loadFromDb = useTodosStore((state) => state.loadFromDb)
  const getCreatedTodos = useTodosStore((state) => state.getCreatedTodos)
  const getDoneTodos = useTodosStore((state) => state.getDoneTodos)
  const getDeletedTodos = useTodosStore((state) => state.getDeletedTodos)

  useEffect(() => {
    loadFromDb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className={styles.list}>
        <motion.header layout key="created">
          已创建
        </motion.header>
        {getCreatedTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
        <motion.hr layout key="created-hr" />

        <motion.header layout key="done">
          已完成
        </motion.header>
        {getDoneTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
        <motion.hr layout key="done-hr" />

        <motion.header layout key="deleted">
          已删除
        </motion.header>
        {getDeletedTodos().map((todo, index) => {
          return <TodoItem index={index} todo={todo} key={todo.uuid} />
        })}
      </div>
    </>
  )
}
