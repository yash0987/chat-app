import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import ThemesPreview from '../sidebar/ThemesPreview';

export default function ThemeLayout() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <ThemesPreview />
      <Outlet />
    </div>
  )
}
