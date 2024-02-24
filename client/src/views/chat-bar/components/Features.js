import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showDeleteModal } from 'features/modal-slice/modalSlice';
import Star from 'views/chat-bar/components/Star';
import Copy from 'views/chat-bar/components/Copy';
import Reply from 'views/chat-bar/components/Reply';
import trash from 'assets/trash.png';
import forward from 'assets/forward.png';

export default function Features(props) {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  return (
    toggleFeaturesState ? (<div className='grid grid-flow-col mx-2 my-1'>
      <Reply />
      <Star star={props.star} setStar={props.setStar} room={props.room} />
      <img onClick={ () => selectedMessagesList.length ? dispatch(showDeleteModal(true)) : null } src={ trash } alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg400}`} />
      <Copy />
      <img src={forward} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg400}`} />
    </div>) : null
  )
}
