import React from 'react';
import { useSelector } from 'react-redux';
import search from './../img/gaming.gif';

export default function DefaultPage() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`w-[64.15rem] h-[91vh] grid place-items-center py-40 ${theme.text700} ${theme.bg100}`}>
      <img src={search} alt="" className='w-1/4' />
      <p>No one's around to play with Wumpus.</p>
    </div>
  )
}
