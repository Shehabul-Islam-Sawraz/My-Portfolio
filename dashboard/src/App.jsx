import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './pages/Login';
import { useDispatch } from "react-redux";
import { getUser } from './store/slices/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path='/' Component={HomePage} /> */}
          <Route path='/login' Component={Login} />
          {/* <Route path='/password/forgot' Component={ForgotPassword} />
          <Route path='/password/reset/:token' Component={ResetPassword} />
          <Route path='/skills' Component={Skills} />
          <Route path='/timeline' Component={Timeline} />
          <Route path='/projects' Component={Projects} />
          <Route path='/project/details/:id' Component={ViewProject} />
          <Route path='/project/update/:id' Component={UpdateProject} /> */}
          {/* <Route path='*' element={<h1>404 Page Not Found</h1>} /> */}
          <Route path='*' element={<Navigate to={"/"} replace />} />
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </Router>
  )
}

export default App
