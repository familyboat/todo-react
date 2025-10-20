import { NavLink, Outlet } from 'react-router'
import './App.css'
import { routerConfig } from './configs'

function App() {
  return (
    <>
      <main className="app">
        <nav className="nav">
          <NavLink to={routerConfig.HomePath}> home </NavLink>
          <NavLink to={routerConfig.ToDoPath}> to-do </NavLink>
        </nav>

        <article className="article">
          <Outlet />
        </article>
      </main>
    </>
  )
}

export default App
