import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom"
import './App.css'
import Login from './components/Auth/login'
import Register from './components/Auth/register'
import Home from './components/Home/home'
import Transaction from './components/Transaction/transaction'
import AdminDashboard from "./components/Admin/adminDashboard"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route
            path='/'
            element={<Home />}
            />
            <Route 
              path='/login'
              element={<Login />}
            />
             <Route 
              path='/register'
              element={<Register />}
            />
              <Route
              path='/transaction'
              element={<Transaction />}
              />

              <Route
              path={"/admin"}
              element={(localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).admin ) ? <AdminDashboard /> : <Navigate to={"/"} />}
		              />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
