import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showDeleteModal } from '../../../features/modal-slice/modalSlice';
// import { toggleFeatures } from '../../../features/toggle-slice/toggleSlice';
import StarMessages from './StarMessages';
import trash from './../../../img/trash.png';
import copy from './../../../img/copy.png';

export default function Features(props) {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const dispatch = useDispatch();

  return (
    toggleFeaturesState ? (<div className='flex mx-2 my-3'>
      <StarMessages star={props.star} setStar={props.setStar} room={props.room} />
      <img onClick={ () => selectedMessagesList.length ? dispatch(showDeleteModal()) : null } src={ trash } alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
      <img src={copy} alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
      {/* <span onClick={ () => dispatch(toggleFeatures()) } className='px-[10px] text-3xl rounded-full hover:bg-violet-400'>&times;</span> */}
    </div>) : null
  )
}
