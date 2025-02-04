import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import { Toaster } from 'react-hot-toast'
import Login from './Pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'
import { useSelector } from 'react-redux'
import Profile from './Pages/Profile'


const App = () => {

  const {loader} = useSelector(state => state.loaderReducer)

  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} ></Toaster>
      {loader && <Loader/>}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
            <Home/>
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
            <Profile/>
            </ProtectedRoute>
          } />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
