import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showDeleteModal } from '../../../features/modal-slice/modalSlice';
import Star from './Star';
import Copy from './Copy';
import trash from './../../../img/trash.png';
import forward from './../../../img/forward.png';
import Reply from './Reply';

export default function Features(props) {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  return (
    toggleFeaturesState ? (<div className='flex mx-2 my-3'>
      <Reply />
      <Star star={props.star} setStar={props.setStar} room={props.room} />
      <img onClick={ () => selectedMessagesList.length ? dispatch(showDeleteModal(true)) : null } src={ trash } alt="" className={`mx-1 w-10 rounded-full ${theme.hoverBg400}`} />
      <Copy />
      <img src={forward} alt="" className={`mx-1 w-10 rounded-full ${theme.hoverBg400}`} />
      {/* <img src={copy} alt="" className='mx-1 w-10 rounded-full ${theme.hoverBg400}' /> */}
      {/* <span onClick={ () => dispatch(toggleFeatures()) } className='px-[10px] text-3xl rounded-full ${theme.hoverBg400}'>&times;</span> */}
    </div>) : null
  )
}
