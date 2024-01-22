import React from 'react';
import { useSelector } from 'react-redux';
import documentIcon from '../../../img/document.png';
import photoIcon from '../../../img/photos.png';
import pollIcon from '../../../img/poll.png';
import audioIcon from '../../../img/headphone.png';

export default function UploadFiles() {
  const theme = useSelector(state => state.theme.value);
  return (
    <section className='absolute bottom-14 left-10'>
      <div className='*:px-3 first:pt-3 last:pb-3 rounded bg-white text-gray-600'>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={documentIcon} className='w-8' alt="" />
          <p>Document</p>
          <input type="file" name="" id="" className='hidden' accept='' />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={photoIcon} className='w-8' alt="" />
          <p>Photos & videos</p>
          <input type="file" name="" id="" className='hidden' />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={pollIcon} className='w-8' alt="" />
          <p>Audio</p>
          <input type="file" name="" id="" className='hidden' />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={audioIcon} className='w-8' alt="" />
          <p>Poll</p>
          <input type="file" name="" id="" className='hidden' />
        </label>
      </div>
    </section>
  )
}
