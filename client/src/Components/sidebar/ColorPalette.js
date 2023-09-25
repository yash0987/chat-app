import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import tick from '../../img/tick.png';
import { selectTheme } from '../../features/theme-slice/themeSlice';

export default function ColorPalette() {
  const dispatch = useDispatch();
  const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'emerald', 'sky', 'blue', 'indigo', 'violet', 'fuchsia', 'pink'];
  const [selectColor, setSelectColor] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);
  // const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
  
  function selectTheColor(index) {
    console.log("I am coloring")
    setSelectColor(selectColor.map((element, i) => {
      if (i === index) {
        return true;
      }
      return false;
    }));

    dispatch(selectTheme(colors[index]));
  }

  return (
    <section className='h-[91vh] grid place-content-center'>
      <div className='grid grid-cols-3 grid-rows-4 place-items-center gap-10 p-20'>{
        colors.map((color, index) => {
          return <div onClick={ () => selectTheColor(index)} className={`p-3 w-14 h-14 rounded-full bg-${color}-500 bg--500`}>
            { selectColor[index] ? <img src={tick} alt="" /> : null }
          </div>
        })
      }</div>
    </section>
  )
}
