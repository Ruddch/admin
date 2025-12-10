import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Admin Panel</h2>
      </div>
      <nav className="sidebar__nav">
        <NavLink
          to="/tokens"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Tokens
        </NavLink>
        <NavLink
          to="/cards"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Cards
        </NavLink>
        <NavLink
          to="/rarities"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Rarities
        </NavLink>
        <NavLink
          to="/tournaments"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Tournaments
        </NavLink>
        <NavLink
          to="/prizes"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Prizes
        </NavLink>
        <NavLink
          to="/pack-types"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Pack Types
        </NavLink>
        <NavLink
          to="/reward-types"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Reward Types
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          Users
        </NavLink>
      </nav>
    </aside>
  )
}

