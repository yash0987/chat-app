import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChat } from '../../../features/chat-slice/chatSlice';
import { unselectAllMessages } from '../../../features/select-message-slice/selectMessageSlice';
import unstar from './../../../img/unstar.png';

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

    const starAndUnstarMessageRequestURI = `http://localhost:5000/starAndUnstar/messages?selectedMessages=${JSON.stringify(selectedMessagesList)}&starStatus=${props.star > 0}&ID=${props.room}&isGroup=${isGroup}`;
    const response = await fetch(starAndUnstarMessageRequestURI, {
      method: 'PUT',
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });
    const data = await response.json();
    console.log(data);
    dispatch(unselectAllMessages());
    props.setStar(0);
  }

  return (
    <div>{
      props.star ? 
      <span onClick={ () => starAndUnstarMessage() } className={`mx-1 px-2 text-3xl rounded-full ${theme.hoverBg400}`}>&#9733;</span> : 
      <img onClick={ () => starAndUnstarMessage() } src={unstar} alt="" className={`mx-1 w-10 rounded-full ${theme.hoverBg400}`} />
    }</div>
  )
}
