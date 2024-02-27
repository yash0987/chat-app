import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CreateGroup from 'views/groups/CreateGroup';
import Chatbox from 'components/Chatbox';
import useFetch from 'hooks/useFetch';

export default function ChatList(props) {
  const [searchChatList, setSearchChatList] = useState([]);
  const [enableCreateGroupPanel, setEnableCreateGroupPanel] = useState(false);
  const theme = useSelector(state => state.theme.value);
  const [chats, setChats] = useFetch({ url: props.chatListRequestURI });

  useEffect(() => {
    setSearchChatList(chats);
  }, [chats])
  
  function searchChats(inputName) {
    const searchChatName = inputName.trim().toLowerCase();
    setSearchChatList(chats.filter((chat) => {
      const chatName = chat.name.toLowerCase();
      return chatName.includes(searchChatName);
    }))
  }

  const createGroupButton = props.isGroup ?
    <button onClick={() => setEnableCreateGroupPanel(true)} className={`w-full flex justify-center ${theme.text400} ${theme.hoverBg200}`}>
      <p className='p-2'>Create new group</p>
      <span className='text-3xl'>&#43;</span>
    </button> : null;
  
  const chatList = searchChatList ?
    searchChatList.map((element) => {
      const route = props.isGroup ? `/groups/${element.id}` : `/chats/@me/${element.id}`;
      const chatinfo = { ...element, isGroup: props.isGroup };
      return <Chatbox key={element.id} chat={chatinfo} route={route} />
    }) : null;

  return (
    <>
      <div className='grid grid-flow-col'>
        <div className={`h-[93vh] place-content-center font-semibold ${theme.bg100}`}>
          <div className='min-w-[25rem] h-full overflow-x-hidden overflow-y-scroll'>
            <input onChange={(e) => searchChats(e.target.value)} type="search" name="" id="" placeholder={props.isGroup ? 'Search Group' : 'Search Friend'} className={`my-4 mx-9 px-5 py-1 w-[83%] rounded-sm ${theme.bg50} border-[1px] border-b-[3px] ${theme.border500} font-normal focus:outline-none ${theme.placeholderText400}`} />
            { createGroupButton }
            { chatList }
          </div>
        </div>
      </div>
      { enableCreateGroupPanel ? <CreateGroup setChats={setChats} setEnableCreateGroupPanel={setEnableCreateGroupPanel} /> : null }
    </>
  )
}
