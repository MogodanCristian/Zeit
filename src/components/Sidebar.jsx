import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa"
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import styled, { createGlobalStyle } from 'styled-components';

const Header = styled.div`
  background-color: #060b26;
  height: 80px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 0;
`

const BarsContainer = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  background: none;
`


const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <IconContext.Provider value={{ color: '#fff' }}>
        <Header>
            <BarsContainer>
                <FaIcons.FaBars onClick={showSidebar}/>
            </BarsContainer>
        </Header>
    </IconContext.Provider>
  )
}

export default Sidebar