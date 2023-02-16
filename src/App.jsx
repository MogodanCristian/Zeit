import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { 
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { createGlobalStyle }from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
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
