import React from 'react';
import { useSelector } from 'react-redux';
import Logout from './Logout';

export default function SectionList(props) {
  const theme = useSelector(state => state.theme.value);

  return (
    <ul className={`w-[38%] mx-8 py-14 ${theme.text800} text-sm`}>
      <li onClick={() => props.setSection('Profile')} className={`px-2 py-1 rounded ${props.section === 'Profile' ? theme.bg300 : null } ${theme.hoverBg200}`}>Profile</li>
      <li className={`px-2 py-1 rounded ${theme.hoverBg200}`}>Starred Messages</li>
      <hr className={`my-3 ${theme.border300}`} />
      <li onClick={() => props.setSection('Appearance')} className={`px-2 py-1 rounded ${props.section === 'Appearance' ? theme.bg300 : null } block ${theme.hoverBg200}`}>Appearance</li>
      <hr className={`my-3 ${theme.border300}`} />
      <Logout />
    </ul>
  )
}
