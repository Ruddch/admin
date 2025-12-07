import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import './AdminLayout.css'

export const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__content">
        <Header />
        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

