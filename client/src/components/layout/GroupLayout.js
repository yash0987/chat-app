import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupSection from '../friend-section/groups/GroupSection';

export default function GroupLayout() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet />
      <GroupSection />
    </div>
  )
}
