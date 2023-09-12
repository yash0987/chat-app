import React from 'react';
import { useSelector } from 'react-redux';
import reply from './../../../img/reply.png';

export default function Reply() {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);

  return (
    selectedMessagesList.length === 1 ? 
      <img src={reply} alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' /> 
    : null    
  )
}
