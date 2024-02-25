import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { prependChat, appendChat } from 'features/chat-slice/chatSlice';
import { ws } from 'utils/websocket';
import ChatBar from 'views/chat-bar/ChatBar';
import Messages from 'views/chat-messages/components/Messages';
import Textbox from 'views/chat-text-box/Textbox';
import DeleteForMeModal from 'components/modal/DeleteForMeModal';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const wallpaper = useSelector(state => state.wallpaper.value);
  const chatInfo = useSelector(state => state.chatinfo.value);
  const dispatch = useDispatch();
  const [star, setStar] = useState(0);
  
  let room;
  if (chatInfo.newChat.isGroup) room = chatInfo.newChat.ID;
  else {
    let IDarray = [ chatInfo.newChat.ID, user.googleID ].sort();
    room = IDarray[0] + IDarray[1];
  }
  console.log(room);

  useEffect(() => {
    ws.onopen = () => console.log("connection has been established");
    return () => ws.onclose = () => console.error("closed connection");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const detailsForRoom = {
        senderID: user.googleID,
        newChat: chatInfo.newChat,
        latestChat: chatInfo.latestChat,
        action: 'join',
      };
      ws.send(JSON.stringify([detailsForRoom]));
    }, 500);

    return () => clearTimeout();
    // eslint-disable-next-line
  }, [room]);
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    console.log("I am receiving")
    dispatch(appendChat(message));
  }
  
  return (
    <section style={{backgroundImage: `url('${wallpaper}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}} className={`w-[64.15rem] h-[91vh] flex flex-col overflow-hidden ${theme.bg50}`}>
      <ChatBar star={star} setStar={setStar} room={room} ws={ws} />
      <Messages star={star} setStar={setStar} elementArray={chat.value} googleID={user.googleID} />
      <Textbox ws={ws} />
      <DeleteForMeModal room={room} />
    </section>
  )
}