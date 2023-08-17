import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { prependChat, appendChat } from '../../features/chat-slice/chatSlice';
import ChatBar from './ChatBar';
import Messages from './Messages';
import TextBox from './TextBox';
import DeleteForMeModal from './../modal/DeleteForMeModal';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.value.user);
  const dispatch = useDispatch();
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [star, setStar] = useState(0);
  
  let IDarray = [ props.secondPerson.ID, user.googleID ];
  IDarray.sort();
  let room = IDarray[0] + IDarray[1];
  console.log(room);

  const ws = new WebSocket('ws://localhost:5000');

  useEffect(() => {
    ws.onopen = () => {
      console.log("connection has been established");
      const detailsForRoom = { sender: user.googleID, receiver: props.secondPerson.ID, oldReceiver: props.oldChatPerson.ID };
      ws.send(JSON.stringify({ ...detailsForRoom, action: 'join' }));
    }
    // eslint-disable-next-line
  }, [room]);
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    console.log("I am receiving")
    dispatch(appendChat([message]));
  }

  async function getChat() {
    const getChatRequestURI = `http://localhost:5000/chat/data?ID=${room}`;
    const response = await fetch(getChatRequestURI, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    });

    const data = await response.json();
    return data;
  }

  function reloadchat() {
    getChat().then((data) => {
      dispatch(prependChat(data));
    })
  }
  
  useEffect(() => {
    reloadchat();
    // eslint-disable-next-line
  }, [room]);

  return (
    <section className='m-2 w-[45rem] rounded overflow-hidden flex flex-wrap content-between bg-violet-50'>
      <ChatBar star={star} setStar={setStar} deleteToggle={deleteToggle} setDeleteToggle={setDeleteToggle} setToggle={props.setToggle} secondPerson={props.secondPerson} room={room} ws={props.ws} />
      <Messages star={star} setStar={setStar} elementArray={chat.value} deleteToggle={deleteToggle} googleID={user.googleID} />
      <TextBox secondPerson={props.secondPerson} ws={ws} />
      <DeleteForMeModal setDeleteToggle={setDeleteToggle} room={room} />
    </section>
  )
}