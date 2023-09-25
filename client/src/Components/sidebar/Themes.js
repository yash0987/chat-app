import React from 'react';
import backButton from '../../img/backButton.png';
import menu from '../../img/menu.png';
import emoji from '../../img/emoji.png';
import sendMessageBtn from '../../img/sendMessageBtn.png';
import { useSelector } from 'react-redux';

export default function Themes() {
  const themeColor = useSelector(state => state.theme.value);
  
  return (
    <section className='col-span-2 h-[91vh] grid grid-cols-1'>
      <div className={`place-self-center w-5/6 h-5/6 flex flex-col overflow-hidden rounded border-[1px] border-${themeColor}-500 bg-${themeColor}-50`}>
        <div className={`flex justify-between px-3 bg-${themeColor}-400  text-white`}>
          <div className='flex'>
            <button><img src={ backButton } alt="" className='m-2 p-2 w-9 rounded-full' /></button>
            <div className='flex'>
              <img src="https://i.pinimg.com/custom_covers/222x/274508608476412825_1635270442.jpg" alt="" className='mx-4 my-2 w-12 rounded-full' />
              <p className='my-4 font-semibold text-lg'>Cai lin</p>
            </div>
          </div>
          <img src={ menu } alt="" className={`my-2 h-12 rounded-full hover:bg-${themeColor}-400`} />
        </div>

        <div className='flex flex-col justify-end px-5 h-full overflow-y-scroll'>
          <div className='select-none'>
            <div className='flex justify-start my-1 p-1 rounded-md text-white'>
              <p className={`px-2 py-1 rounded-md bg-${themeColor}-500`}>
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
              <p className={`px-2 py-1 rounded-md bg-${themeColor}-500`}>
                Get lost 😏
                <span className = 'flex justify-end text-[10px]'>Thu, 14 Sep 2023 6:14 pm</span>
              </p>
            </div>
          </div>
        </div>

        <div className='px-2 flex bg-white'>
          <button><img src={emoji} alt="" className={`w-12 p-2 rounded-full hover:bg-${themeColor}-200`} /></button>
          <div className='flex flex-col justify-end w-full h-10 m-4'>
            <textarea cols="0" rows="0" placeholder='Type a message...' className={`py-2 resize-none focus:outline-none placeholder:text-${themeColor}-400`}></textarea>
          </div>
          <button><img src={sendMessageBtn} alt="" className={`w-12 rounded-full bg-${themeColor}-400 hover:bg-${themeColor}-500`} /></button>
        </div>
      </div>
    </section>
  )
}
