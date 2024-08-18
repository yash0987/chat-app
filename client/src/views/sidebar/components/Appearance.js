import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme } from 'features/theme-slice/themeSlice';
import { setAuth } from 'features/auth-slice/authSlice';
import { fetchRequest } from 'utils/fetchRequest';
import { themes } from 'data/ThemesColors';
import tick from 'assets/tick.png';
import ThemesPreview from './ThemesPreview';

export default function Appearance() {
  const auth = useSelector(state => state.auth.value);
  const dispatch = useDispatch();
  const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'emerald', 'sky', 'blue', 'indigo', 'violet', 'fuchsia', 'pink'];
  const [selectColor, setSelectColor] = useState([...new Array(12).fill(false)].map((element, index) => index === auth.user.theme));
  
  async function selectTheColor(index) {
    console.log("I am coloring")
    const url = 'http://localhost:5000/theme';
    const data = await fetchRequest({ url, method: 'PUT', body: { theme: index } });
    console.log(data);
    setSelectColor(selectColor.map((element, i) => {
      if (i === index) {
        return true;
      }
      return false;
    }));
    
    dispatch(selectTheme(themes[index]));
    dispatch(setAuth({ ...auth, user: { ...auth.user, theme: index } }))
  }

  return (
    <div>
      <p className='text-xl font-semibold'>Appearance</p>
      <ThemesPreview />

      <p className='mb-1 font-bold text-xs'>THEME</p>
      <div className='my-2 flex flex-wrap border border-gray-700 rounded-lg'>{
        colors.map((color, index) => {
          return <div onClick={ () => selectTheColor(index)} key={index} className={`grid grid-flow-col grid-rows-2 relative m-[6px] mx-4 size-14 rounded-full overflow-hidden`}>
            { selectColor[index] ? <img src={tick} alt="" className='absolute right-4 top-4 size-6 rounded-full bg-gray-800' /> : null }
            <div className={`col-span-2 bg-${color}-500`}></div>
            <div className={`bg-${color}-100`}></div>
            <div className={`bg-${color}-300`}></div>
          </div>
        })
      }</div>
    </div>
  )
}
