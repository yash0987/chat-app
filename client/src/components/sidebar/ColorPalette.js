import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import tick from '../../assets/tick.png';
import wallpaper from '../../assets/wallpaper.png';
import lightIcon from '../../assets/sun.png';
import darkIcon from '../../assets/moon.png';
import { selectTheme } from '../../features/theme-slice/themeSlice';
import { themes } from './../../data/ThemesColors';

export default function ColorPalette() {
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();
  const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'emerald', 'sky', 'blue', 'indigo', 'violet', 'fuchsia', 'pink'];
  const [selectColor, setSelectColor] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);

  function selectTheColor(index) {
    console.log("I am coloring")
    setSelectColor(selectColor.map((element, i) => {
      if (i === index) {
        return true;
      }
      return false;
    }));

    dispatch(selectTheme(themes[index]));
  }

  return (
    <section className='grid place-content-center'>
      <Link to={'/themes/wallpaper'} className={`flex justify-center my-4 p-2 rounded text-gray-500 text-sm font-semibold ${theme.bg200}`}>
        <img src={wallpaper} alt="" className='w-6 mx-1' />
        Change wallpaper
      </Link>
		  <hr />
		  <div className={`m-4 flex justify-center rounded-full text-sm border-[1px] ${theme.border400}`}>
		    <button className={`flex rounded-full px-10 py-2 ${theme.hoverBg100}`}>
		      <img src={lightIcon} className='w-6' alt="" />
		      Light
		    </button>
		    <button className={`flex rounded-full px-10 py-2 ${theme.hoverBg100}`}>
		      <img src={darkIcon} className='w-6' alt="" />
		      Dark
		    </button>
		  </div>
      <div className='grid grid-cols-4 gap-6'>{
        colors.map((color, index) => {
          return <div key={index} className='bg-gray-200 rounded-2xl relative'>
            { selectColor[index] ? <img src={tick} alt="" className='absolute right-0' /> : null }
            <div onClick={ () => selectTheColor(index)} className={`grid grid-flow-col grid-rows-2 m-[6px] size-14 rounded-full overflow-hidden`}>
              <div className={`col-span-2 bg-${color}-500`}></div>
              <div className={`bg-${color}-100`}></div>
              <div className={`bg-${color}-300`}></div>
            </div>
          </div>
        })
      }</div>
    </section>
  )
}
