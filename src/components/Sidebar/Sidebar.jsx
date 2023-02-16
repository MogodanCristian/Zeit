import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import styled from 'styled-components';

const Nav = styled.div`
  background-color: #060b26;
  height: 80px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  background: none;
`;

const NavMenu = styled.nav`
  background-color: #060b26;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: -100%;
  transition: 850ms;

  &.active {
    left: 0;
    transition: 350ms;
  }
`;

const NavText = styled.li`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 8px 0px 8px 16px;
  list-style: none;
  height: 60px;

  a {
    text-decoration: none;
    color: #f5f5f5;
    font-size: 18px;
    width: 95%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;

    &:hover {
      background-color: #1a83ff;
    }
  }
`;

const NavbarToggle = styled.li`
  background-color: #060b26;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const Span = styled.span`
  margin-left: 16px;
`;

const NavMenuItems = styled.ul`
    width: 100%;
    padding:0;
    margin:0;
`

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavLink to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </NavLink>
        </Nav>
        <NavMenu className={sidebar ? 'active' : ''}>
          <NavMenuItems onClick={showSidebar}>
            <NavbarToggle>
              <NavLink to='#'>
                <AiIcons.AiOutlineClose />
              </NavLink>
            </NavbarToggle>
            {SidebarData.map((item, index) => {
              return (
                <NavText key={index}>
                  <Link to={item.path}>
                    {item.icon}
                    <Span>{item.title}</Span>
                  </Link>
                </NavText>
              );
            })}
          </NavMenuItems>
        </NavMenu>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;