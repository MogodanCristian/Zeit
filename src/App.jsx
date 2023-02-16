
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

  return (
    <Router>
      <GlobalStyle/>
        <Sidebar/>
        <Routes>
            <Route path='/' element = {<Dashboard/>}/>
        </Routes>
    </Router>
  )
}

export default App
