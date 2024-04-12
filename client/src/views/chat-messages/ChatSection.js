import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { prependChat, appendChat } from 'features/chat-slice/chatSlice';
import { ws } from 'utils/websocket';
import { createRoomID } from 'utils/room';
import ChatBar from 'views/chat-bar/ChatBar';
import Messages from 'views/chat-messages/components/Messages';
import Textbox from 'views/chat-text-box/Textbox';
import DeleteForMeModal from 'components/modal/DeleteForMeModal';
import useFetchChats from 'hooks/useFetchChats';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const wallpaper = useSelector(state => state.wallpaper.value);
  const chatInfo = useSelector(state => state.chatinfo.value);
  const dispatch = useDispatch();
  const [star, setStar] = useState(0);
  const room = createRoomID({ 
    idArray: [ chatInfo.newChat.ID, user._id ],
    isGroup: chatInfo.newChat.isGroup
  })
  console.log(room);

  const getChatRequestURI = chatInfo.newChat.isGroup ?
  `http://localhost:5000/group/data/${room}` : `http://localhost:5000/chat/data/${room}`;
  const getChats = useFetchChats({ url: getChatRequestURI, callback: prependChat });

  useEffect(() => {
    getChats()
    // eslint-disable-next-line
  }, [room]);

  useEffect(() => {
    ws.onopen = () => console.log("connection has been established");
    return () => ws.onclose = () => console.error("closed connection");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const detailsForRoom = {
        senderID: user._id,
        newChat: { ID: chatInfo.newChat.ID, isGroup: chatInfo.newChat.isGroup },
        latestChat: { ID: chatInfo.latestChat.ID, isGroup: chatInfo.latestChat.isGroup },
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
    <section style={{backgroundImage: `url('${wallpaper}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}} className={theme.bg50}>
      <ChatBar star={star} setStar={setStar} room={room} />
      <Messages star={star} setStar={setStar} elementArray={chat.value} room={room} />
      <Textbox />
      <DeleteForMeModal room={room} />
    </section>
  )
}