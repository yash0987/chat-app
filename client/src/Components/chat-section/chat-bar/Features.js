import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showDeleteModal } from '../../../features/modal-slice/modalSlice';
import StarMessages from './StarMessages';
import trash from './../../../img/trash.png';

export default function Features(props) {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const dispatch = useDispatch();

  return (
    props.deleteToggle ? (<div className='flex mx-2 my-3'>
      <StarMessages star={props.star} setStar={props.setStar} setDeleteToggle={props.setDeleteToggle} room={props.room} />
      <img onClick={ () => selectedMessagesList.length ? dispatch(showDeleteModal()) : null } src={ trash } alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
      <span onClick={ () => props.setDeleteToggle(false) } className='px-[10px] text-3xl rounded-full hover:bg-violet-400'>&times;</span>
    </div>) : null
  )
}
