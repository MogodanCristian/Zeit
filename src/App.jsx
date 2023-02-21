
import {useEffect} from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import { 
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { createGlobalStyle }from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import Login from './pages/Login'
import { loginSuccess } from './redux/userReducer'

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
  body {
    margin: 0;
    padding:0;
    font-family: 'Lato', sans-serif;
    box-sizing: border-box;
  }
`;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('USER_STORAGE'));
    console.log(loggedUser)
    if (loggedUser) {
      dispatch(loginSuccess(loggedUser));
    }
  }, []);
  
  const user = useSelector((state) => state.user.currentUser);
  return (
    <Router>
      <GlobalStyle/>
      {!user && (
        <Routes>
          <Route path ='/login' element={<Login/>}/>
          <Route path='/' element = {<Navigate to={'/login'}/>}/>
          <Route path='*' element = {<Navigate to={'/login'}/>}/>
        </Routes>
      )}
      {user && user.role === 'manager' && (
        <>
          <Sidebar/>
          <Routes>
            <Route path='/' element = {<Dashboard/>}/>
            <Route path='*' element = {<Navigate to={'/'}/>}/>
          </Routes>
        </>
      )}
      {user && user.role === 'employee' && (
        <>
          <Sidebar/>
          <Routes>
            <Route path='/' element = {<Dashboard/>}/>
            <Route path='*' element = {<Navigate to={'/'}/>}/>
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
