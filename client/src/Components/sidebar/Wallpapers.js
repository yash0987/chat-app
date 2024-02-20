import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectWallpaper } from '../../features/wallpaper-slice/wallpaperSlice';
import upload from '../../img/upload.png';
import wallpaper1 from '../../wallpaper/wallpaper1.jpg';
import wallpaper2 from '../../wallpaper/wallpaper2.jpg';
import wallpaper3 from '../../wallpaper/wallpaper3.jpg';
import wallpaper4 from '../../wallpaper/wallpaper4.jpg';
import wallpaper5 from '../../wallpaper/wallpaper5.jpg';
import wallpaper6 from '../../wallpaper/wallpaper6.jpg';
import wallpaper7 from '../../wallpaper/wallpaper7.jpg';
import wallpaper8 from '../../wallpaper/wallpaper8.jpg';
import wallpaper9 from '../../wallpaper/wallpaper9.jpg';
import wallpaper10 from '../../wallpaper/wallpaper10.jpg';

export default function Wallpapers() {
  const [photo, setPhoto] = useState({});
  const theme = useSelector(state => state.theme.value);
  const wallpapers = [ wallpaper1, wallpaper2, wallpaper3, wallpaper4, wallpaper5, wallpaper6, wallpaper7, wallpaper8, wallpaper9, wallpaper10 ];
  const dispatch = useDispatch();

  function previewWallpaper(e) {
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = (e) => {
      dispatch(selectWallpaper(e.target.result));
      console.log(e.target.result)
    }
    setPhoto(e.target.files[0]);
    console.log(photo);
  }
  
  async function uploadImage() {
    const formdata = new FormData();
    formdata.append('wallpaper', photo);
    
    const response = await fetch(`http://localhost:5000/wallpaper`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: formdata
    })

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className='grid grid-flow-row'>
      <Link to={'/themes'} className='flex mx-10 my-2 text-xl text-slate-500'>
        &larr;
        <p className='px-2 py-1 rounded-full text-sm'> Return to themes</p>
      </Link>
      <div className='grid grid-cols-2 justify-self-center gap-1 w-4/5 h-72 overflow-y-scroll'>
        <div onClick={() => dispatch(selectWallpaper(""))} className={`grid place-content-center rounded text-xs border-[1px] ${theme.border500} ${theme.text500} ${theme.bg50}`}>Default Wallpaper</div>
        {
          wallpapers.map((element, index) => {
            return <img key={index} onClick={() => dispatch(selectWallpaper(element))} src={element} alt="" className='rounded' />
          })
        }
        <label className='place-self-center'>
          <input onChange={(e) => previewWallpaper(e)} type="file" name="wallpaper" accept="image/png, image/jpeg, image/apng, image/avif, image/svg+xml, image/webp" className='hidden w-0 h-0' />
          <img src={upload} alt="" className='w-10' />
          <p className={`text-xs ${theme.text500}`}>Upload</p>
        </label>
      </div>

      <button onClick={() => uploadImage()} className={`mx-36 my-4 px-4 py-1 rounded-full border-[1px] ${theme.border500} ${theme.text500} ${theme.bg50} ${theme.hoverBg200}`}>Set Wallpaper</button>
    </div>
  )
}
