
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import AddEmployee from './pages/AddEmployee.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="top-nav">
          <div className="brand">DemoApp</div>
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
            <NavLink
              to="/add-employee"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Add Employee
            </NavLink>
          </nav>
        </header>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-employee" element={<AddEmployee />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
