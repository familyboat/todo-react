import { NavLink, useLocation, useOutlet } from 'react-router'
import './App.css'
import { routerConfig } from './configs'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import React, { createRef } from 'react'

type RouteType<T> = {
  path: string
  nodeRef: React.RefObject<T>
}

const routes: Array<RouteType<unknown>> = [
  {
    path: routerConfig.HomePath,
    nodeRef: createRef(),
  },
  {
    path: routerConfig.ToDoPath,
    nodeRef: createRef(),
  },
]

function App() {
  const location = useLocation()
  const currentOutlet = useOutlet()
  const route = routes.find(
    (route) => route.path === location.pathname
  ) as RouteType<HTMLDivElement>

  return (
    <>
      <main className="app">
        <nav className="nav">
          <NavLink to={routerConfig.HomePath}> home </NavLink>
          <NavLink to={routerConfig.ToDoPath}> to-do </NavLink>
        </nav>

        <article className="article">
          <SwitchTransition mode="out-in">
            <CSSTransition
              nodeRef={route.nodeRef}
              classNames="fade"
              timeout={300}
              key={location.pathname}
            >
              <div ref={route.nodeRef}>{currentOutlet}</div>
            </CSSTransition>
          </SwitchTransition>
        </article>
      </main>
    </>
  )
}

export default App
