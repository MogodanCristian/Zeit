import {useEffect, useState} from 'react'
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
import Projects from './pages/Projects'
import Unauthorized from './pages/Unauthorized'
import Team from './pages/Team'

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
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.currentUser);
  const jwt = useSelector((state) => state.user.jwt);
  
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('USER_STORAGE'));
    if (loggedUser) {
      dispatch(loginSuccess({user: loggedUser.user, jwt: loggedUser.jwt}));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <GlobalStyle />
      <>
        {user && <Sidebar />}
        <Routes>
          <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
          <Route path='/unauthorized' element={user ? <Unauthorized /> : <Navigate to={'/login'} />} />
          {user === null ? (
            <Route path='*' element={<Navigate to='/login' replace />} />
          ) : (
            <>
              <Route path='/' element={<Dashboard />} />
              <Route path='/team' element={<Team />} />
              <Route path='/projects' element={user.role === 'manager' ? <Projects /> : <Navigate to={'/unauthorized'} />} />
            </>
          )}
        </Routes>
      </>
    </Router>
  );
}

export default App;