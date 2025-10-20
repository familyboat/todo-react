import type { RouteObject } from 'react-router'
import App from '../App'
import { routerConfig } from '../configs'
import Home from './home'
import Todo from './todo'

export const routes = [
  {
    element: <App />,
    children: [
      {
        path: routerConfig.HomePath,
        element: <Home />,
      },
      {
        path: routerConfig.ToDoPath,
        element: <Todo />,
      },
    ],
  },
] satisfies RouteObject[]
