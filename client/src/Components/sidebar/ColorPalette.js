import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import tick from '../../img/tick.png';
import { selectTheme } from '../../features/theme-slice/themeSlice';
import { themes } from './ThemesColors';

export default function ColorPalette() {
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
      <div className='grid grid-cols-4 gap-2'>{
        colors.map((color, index) => {
          return <div className='bg-gray-200 rounded-2xl relative'>
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
