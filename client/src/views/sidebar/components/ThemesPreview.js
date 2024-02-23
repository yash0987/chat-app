import React from 'react';
import { useSelector } from 'react-redux';
import backButton from '../../../assets/backButton.png';
import menu from '../../../assets/menu.png';
import emoji from '../../../assets/emoji.png';
import plusIcon from '../../../assets/plus.png';

export default function ThemesPreview(props) {
  const theme = useSelector(state => state.theme.value);
  const wallpaper = useSelector(state => state.wallpaper.value);
  
  return (
    <section className='w-[64.15rem] h-full grid grid-cols-1'>
      <div style={{backgroundImage: `url('${wallpaper}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}} className={`place-self-center w-5/6 h-5/6 flex flex-col overflow-hidden rounded border-[1px] ${theme.border500} ${theme.bg50}`}>
        <div className={`px-8 py-1 relative flex justify-between ${theme.bg400} text-white`}>
          <div className='flex'>
            <button><img src={ backButton } alt="" className='w-5 rounded-full' /></button>
            <div className='grid grid-flow-col place-items-center'>
              <img src="https://i.pinimg.com/custom_covers/222x/274508608476412825_1635270442.jpg" alt="" className='mx-3 w-8 rounded-full' />
              <p className='font-semibold'>Cai lin</p>
            </div>
          </div>
          <img src={ menu } alt="" className={`w-10 rounded-full ${theme.hoverBg400}`} />
        </div>

        <div className='flex flex-col justify-end px-5 h-full overflow-y-scroll'>
          <div className='select-none'>
            <div className='flex justify-start my-1 p-1 rounded-md text-white'>
              <p className={`px-2 py-1 rounded-md ${theme.bg500}`}>
                Hi
                <span className = 'flex justify-end text-[10px] text-white'>Thu, 14 Sep 2023 5:48 pm</span>
              </p>
            </div>

            <div className='flex justify-end my-1 p-1 rounded-md text-gray-600'>
              <p className='px-2 py-1 rounded-md bg-gray-200'>
                Hi Cai lin🥰
                <span className = 'flex justify-end text-[10px]'>Thu, 14 Sep 2023 6:12 pm</span>
              </p>
            </div>

            <div className='flex justify-start my-1 p-1 rounded-md text-white'>
              <p className={`px-2 py-1 rounded-md ${theme.bg500}`}>
                Get lost 😏
                <span className = 'flex justify-end text-[10px]'>Thu, 14 Sep 2023 6:14 pm</span>
              </p>
            </div>
          </div>
        </div>

        <div className='relative w-full grid place-items-center'>
          <div className='mb-2 px-2 w-[94%] rounded-lg flex place-items-center bg-white'>
            <div className='grid grid-flow-col'>
              <button className={`rounded-full text-4xl text-white ${theme.bg200} ${theme.hoverBg300}`}>
                <img src={plusIcon} alt="" className='w-8 p-1' />
              </button>
              <button className='mx-2'>
                <img src={emoji} alt="" className={`w-9 p-1 rounded-full ${theme.hoverBg200}`} />
              </button>
            </div>
            <div className='w-full'>
              <textarea cols="0" rows="0" placeholder='Type a message...' className={`w-full mt-2 h-7 resize-none focus:outline-none ${theme.placeholderText400}`}></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
