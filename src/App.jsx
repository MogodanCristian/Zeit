import {useEffect, useState} from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import { 
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { createGlobalStyle }from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import Login from './pages/Login'
import { loginSuccess } from './redux/userReducer'
import Projects from './pages/Projects'

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

  const user = useSelector((state) => state.user.currentUser);
  const [lastLocation, setLastLocation] = useState(localStorage.getItem('LAST_LOCATION'));

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('USER_STORAGE'));
    console.log(loggedUser)
    console.log(lastLocation)
    if (loggedUser) {
      dispatch(loginSuccess(loggedUser));
    }
  }, []);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("LAST_LOCATION", window.location.pathname);
      setLastLocation(window.location.pathname)
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
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
            <Route path='/projects' element = {<Projects/>}/>
            <Route path='*' element = {lastLocation? <Navigate to={lastLocation}/> : <Navigate to={'/'}/>}/>
          </Routes>
        </>
      )}
      {user && user.role === 'employee' && (
        <>
        
          <Sidebar/>
          <Routes>
            <Route path='/' element = {<Dashboard/>}/>
            <Route path='/projects' element = {<Projects/>}/>
            <Route path='*' element = {lastLocation? <Navigate to={lastLocation}/> : <Navigate to={'/'}/>}/>
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
