import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import ThemesPreview from 'views/sidebar/components/ThemesPreview';

export default function ThemeLayout() {
  const theme = useSelector(state => state.theme.value);
  const wallpaper = useSelector(state => state.wallpaper.value);

  return (
    <div className={`grid grid-flow-col grid-cols-[4fr_1fr]`}>
      <ThemesPreview />
      <section className='grid place-content-center px-10 h-[93vh] bg-gray-50'>
        <div className='text-gray-700 text-sm'>
        Appearance
          <div style={ wallpaper ? {backgroundImage: `url('${wallpaper}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"} : null} className={`grid place-content-center my-1 w-[343px] h-[195.37px] rounded text-sm border-[1px] ${theme.border500} ${theme.text500} ${theme.bg50}`}>
            { wallpaper ? null : "Default Wallpaper" }
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  )
}
