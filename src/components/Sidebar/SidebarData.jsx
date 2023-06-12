import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <IoIcons.IoMdMail />,
  },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
  },

];

export const SidebarDataAdmin = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
},
{
  title: 'Tools',
  path: '/tools',
  icon: <AiIcons.AiFillTool/>
},
{
  title: 'Support',
  path: '/support',
  icon: <IoIcons.IoMdHelpCircle />,
},                                   
]