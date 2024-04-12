import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateChat } from 'features/chat-slice/chatSlice';
import { showDeleteModal } from 'features/modal-slice/modalSlice';
import { reply } from 'features/reply-slice/replySlice';
import { replyMessageToggle } from 'features/toggle-slice/toggleSlice';
import { selectMessage } from 'features/select-message-slice/selectMessageSlice';
import { fetchRequest } from 'utils/fetchRequest';
import editIcon from 'assets/edit_icon.png';
import pinIcon from 'assets/pin_icon.png';
import replyIcon from 'assets/reply_icon.png';
import copyIcon from 'assets/copy_icon.png';
import starIcon from 'assets/star_icon.png';
import unstarIcon from 'assets/unstar_icon.png';
import binIcon from 'assets/bin_icon.png';

export default function PopupList(props) {
  const { coordinates, message, status } = props.visibilityOfPopupList;
  const chat = useSelector(state => state.chat.value);
  const isGroup = useSelector(state => state.chatinfo.value.newChat.isGroup);
  const dispatch = useDispatch();

  function replyToMessage () {
    let replyForMessage = message.collectedText.slice(0, Math.min(50, message.collectedText.length));
    let array = replyForMessage.split('\n');
    if (array.length > 3) {
      replyForMessage = array.splice(0, 3).join('\n') + '...';
    }
    dispatch(replyMessageToggle(true));
    dispatch(reply({
      repliedMessageID: message.messageID,
      replyToPerson: message.senderName,
      replyForMessage
    }));
  }

  function copyText() {
    const collectedText = message.collectedText;
    navigator.clipboard.writeText(collectedText);
  }

  async function starMessage() {
    let updatedMessageArray = JSON.parse(JSON.stringify(chat));
    updatedMessageArray = updatedMessageArray.map(element => {
      if (message.messageID === element.messageID) {
        element.star ^= 1;
      }
      return element;
    })
    
    const starMessageRequestURI = isGroup ? 
    'http://localhost:5000/group/starAndUnstar/messages' : 'http://localhost:5000/starAndUnstar/messages';

    const data = await fetchRequest({
      url: starMessageRequestURI,
      method: 'PUT',
      body: {
        selectedMessages: [message.messageID],
        room: props.room,
        starStatus: message.star ^ 1
      }
    });
    dispatch(updateChat(updatedMessageArray));
    console.log(data);
  }

  function openDeleteModal() {
    dispatch(selectMessage(message.messageID));
    dispatch(showDeleteModal(true));
  }

  return (
    status ?
    <div onClick={() => props.setVisibilityOfPopupList({ status: false })} className={`absolute z-10 bg-gray-50 shadow-sm shadow-gray-200 rounded overflow-hidden`} style={{...coordinates}}>
      <ul className='py-2 whitespace-nowrap text-sm text-gray-800'>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Edit Message <img src={editIcon} alt="" className='ml-2 w-6 h-6' />
        </li>
        <li className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Pin Message <img src={pinIcon} alt="" className='ml-2 w-6 h-6' />
        </li>
        <li onClick={() => replyToMessage()} className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Reply <img src={replyIcon} alt="" className='ml-2 w-6 h-6' />
        </li>
        <li onClick={() => copyText()} className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          Copy Text <img src={copyIcon} alt="" className='ml-2 w-6 h-6' />
        </li>
        <li onClick={() => starMessage()} className='flex justify-between px-4 py-[6px] font-semibold text-gray-700 hover:bg-gray-200'>
          { message.star ? 'Unstar Message' : 'Star Message' } <img src={message.star ? unstarIcon : starIcon} alt="" className='ml-2 w-6 h-6' />
        </li> 
        <li onClick={() => openDeleteModal()} className='flex justify-between px-4 py-[6px] font-semibold text-red-600 hover:bg-red-200'>
          Delete Message <img src={binIcon} alt="" className='ml-2 w-6 h-6' />
        </li> 
      </ul>
    </div> : null
  )
}
