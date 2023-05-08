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
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import Buckets from './pages/Buckets'
import AdminTools from './pages/AdminTools'
import Charts from './pages/Charts'

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
              <Route path='/' element={user.role === 'admin'? <AdminDashboard/> :<Dashboard />} />
              <Route path='/team' element={<Team />} />
              <Route path='/projects' element={<Projects />} />
              <Route path = '/forgotPassword' element={<ForgotPassword/>}/>
              <Route path = '/projects/:projectID/:projectTitle/buckets' element={<Buckets/>}/>
              <Route path='/tools' element={user.role === 'admin'? <AdminTools/> : <Unauthorized/>}/>
              <Route path='/projects/:projectID/:projectTitle/charts' element={<Charts/>}/>
            </>
          )}
        </Routes>
      </>
    </Router>
  );
}

export default App;