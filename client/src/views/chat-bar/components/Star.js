import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChat } from 'features/chat-slice/chatSlice';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { fetchRequest } from 'utils/fetchRequest';
import unstar from 'assets/unstar.png';

export default function Star(props) {
  const chat = useSelector(state => state.chat.value);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const theme = useSelector(state => state.theme.value);
  const isGroup = useSelector(state => state.chatinfo.value.newChat.isGroup);
  const dispatch = useDispatch();

  async function starAndUnstarMessage() {
    let updatedMessageArray = JSON.parse(JSON.stringify(chat));
    selectedMessagesList.forEach(elementToUpdate => {
      updatedMessageArray = updatedMessageArray.map(element => {
        if (elementToUpdate === element.messageID) {
          element.star = props.star > 0;
        }
        return element;
      })
    })
    dispatch(updateChat(updatedMessageArray));

    const starMessageRequestURI = isGroup ? 
    'http://localhost:5000/group/starAndUnstar/messages' : 'http://localhost:5000/starAndUnstar/messages';
    
    const data = await fetchRequest({ url: starMessageRequestURI, method: 'PUT', body: { selectedMessages: selectedMessagesList, room: props.room, starStatus: props.star > 0 } });
    console.log(data);
    dispatch(unselectAllMessages());
    props.setStar(0);
  }

  return (
    <div>{
      props.star ? 
      <span onClick={ () => starAndUnstarMessage() } className={`mx-1 px-2 text-xl rounded-full ${theme.hoverBg400}`}>&#9733;</span> : 
      <img onClick={ () => starAndUnstarMessage() } src={unstar} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg400}`} />
    }</div>
  )
}
