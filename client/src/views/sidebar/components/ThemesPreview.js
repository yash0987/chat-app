import React from 'react';
import { useSelector } from 'react-redux';

export default function ThemesPreview(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  
  return (
    <section className={`my-5 grid`}>
      <div className={`w-full rounded border-[1px] ${theme.border500} ${theme.bg50}`}>
        <div className='select-none'>
          <div className={`grid grid-flow-col justify-start rounded-t ${theme.hoverBg100}`}>
            <div className='my-1 grid place-self-start'>
              <img src="https://i.pinimg.com/custom_covers/222x/274508608476412825_1635270442.jpg" alt="" className='size-9 mx-5 my-1 object-cover rounded-full' />
            </div>

            <div className = {`min-w-[30rem] max-w-[60rem]`}>
              <p className='text-base font-semibold'>Cai Lin <span className='text-[11px] font-normal'>Thu, 14 Sep 2023 5:48 pm</span></p>
              Hi
            </div>
          </div>

          <div className={`grid grid-flow-col justify-start ${theme.hoverBg100}`}>
            <div className='my-1 grid place-self-start'>
              <img src={user.photoURL} alt="" className='size-9 mx-5 my-1 object-cover rounded-full' />
            </div>

            <div className = {`min-w-[30rem] max-w-[60rem]`}>
              <p className='text-base font-semibold'>{user.name} <span className='text-[11px] font-normal'>Thu, 14 Sep 2023 6:12 pm</span></p>
              Hi Cai lin🥰 <br/> Can I take your time?
            </div>
          </div>

          <div className={`grid grid-flow-col justify-start rounded-b ${theme.hoverBg100}`}>
            <div className='my-1 grid place-self-start'>
              <img src="https://i.pinimg.com/custom_covers/222x/274508608476412825_1635270442.jpg" alt="" className='size-9 mx-5 my-1 object-cover rounded-full' />
            </div>

            <div className = {`min-w-[30rem] max-w-[60rem]`}>
              <p className='text-base font-semibold'>Cai Lin <span className='text-[11px] font-normal'>Thu, 14 Sep 2023 6:14 pm</span></p>
              Get lost 😏
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
