import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { appendChat, updateChat } from 'features/chat-slice/chatSlice';
// import { prependChat, appendChat, updateChat } from 'features/chat-slice/chatSlice';
import { ws } from 'utils/websocket';
import ChatBar from 'views/chat-bar/ChatBar';
import Messages from 'views/chat-messages/components/Messages';
import Textbox from 'views/chat-text-box/Textbox';
import DeleteForMeModal from 'components/modal/DeleteForMeModal';
// import useFetchChats from 'hooks/useFetchChats';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const wallpaper = useSelector(state => state.wallpaper.value);
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const room = params.id
  console.log(room);

  // const getChatRequestURI = chatInfo.newChat.isGroup ?
  // `http://localhost:5000/group/data/${room}` : `http://localhost:5000/chat/data/${room}`;
  // const getChats = useFetchChats({ url: getChatRequestURI, callback: prependChat });

  // useEffect(() => {
  //   getChats()
  //   // eslint-disable-next-line
  // }, [room]);

  useEffect(() => {
    ws.onopen = () => console.log("connection has been established");
    return () => ws.onclose = () => console.error("closed connection");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const detailsForRoom = {
        senderID: user._id,
        chat: { id: params.id, isGroup: location.pathname === `/groups/${params.id}` },
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
    if (message[0].action === 'edit') {
      const { messageID, editedMessage } = message[0];
      const updatedMessagesList = chat.value.map((element) => {
        if (element.messageID === messageID) {
          return {
            ...element,
            collectedText: editedMessage,
            editedStatus: true
          }
        }
        return element;
      })
      dispatch(updateChat(updatedMessagesList));
      return ;
    }
    dispatch(appendChat(message));
  }
  
  return (
    <section style={{backgroundImage: `url('${wallpaper}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}} className={theme.bg50}>
      <ChatBar />
      <Messages elementArray={chat.value} room={room} />
      <Textbox />
      <DeleteForMeModal room={room} />
    </section>
  )
}