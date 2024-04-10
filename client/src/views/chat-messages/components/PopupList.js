import React from 'react';
import editIcon from 'assets/edit_icon.png';
import pinIcon from 'assets/pin_icon.png';
import replyIcon from 'assets/reply_icon.png';
import copyIcon from 'assets/copy_icon.png';
import binIcon from 'assets/bin_icon.png';

export default function PopupList(props) {
  const { coordinates, status } = props.visibilityOfPopupList;

  return (
    status ?
    <div onClick={() => props.setVisibilityOfPopupList({ top: '0px', bottom: '0px', left: '0px', right: '0px', status: false })} className={`absolute z-10 bg-gray-50 shadow-sm shadow-gray-200 rounded overflow-hidden`} style={{...coordinates}}>
      <ul className='py-2 whitespace-nowrap text-sm text-gray-800'>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Edit Message <img src={editIcon} alt="" className='ml-2 w-6 h-6' /></li>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Pin Message <img src={pinIcon} alt="" className='ml-2 w-6 h-6' /></li>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Reply <img src={replyIcon} alt="" className='ml-2 w-6 h-6' /></li>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Copy Text <img src={copyIcon} alt="" className='ml-2 w-6 h-6' /></li>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-red-600 hover:bg-red-200'>
          Delete Message <img src={binIcon} alt="" className='ml-2 w-6 h-6' /></li> 
      </ul>
    </div> : null
  )
}
