
import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import { 
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { createGlobalStyle }from 'styled-components'
import { useSelector } from 'react-redux'
import Login from './pages/Login'

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
  const user = useSelector((state) => state.user.currentUser);
  return (
    <Router>
      <GlobalStyle/>
        {user && <Sidebar/>}
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element = {user ? <Dashboard/> : <Navigate to={'/login'}/>}/>
        </Routes>
    </Router>
  )
}

export default App
