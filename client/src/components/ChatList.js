import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreateGroup from 'views/groups/CreateGroup';
import Chatbox from 'components/Chatbox';
import personIcon from 'assets/personw.png';
import groupIcon from 'assets/groupw.png';

export default function ChatList(props) {
  const [searchChatList, setSearchChatList] = useState([]);
  const [enableCreateGroupPanel, setEnableCreateGroupPanel] = useState(false);
  const theme = useSelector(state => state.theme.value);
  const chats = props.chats;

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

  const createGroupButton = props.chatType === 'group' ?
    <button onClick={() => setEnableCreateGroupPanel(true)} className={`w-full flex justify-center ${theme.text400} ${theme.hoverBg200}`}>
      <p className='p-2'>Create new group</p>
      <span className='text-3xl'>&#43;</span>
    </button> : null;
  
  const chatList = searchChatList ?
    searchChatList.map((element) => {
      const route = props.chatType === 'group' ? `/groups/${element._id}` : `/chats/@me/${element._id}`;
      const chatinfo = { ...element, chatType: props.chatType };
      return <Chatbox key={element._id} chat={chatinfo} route={route} />
    }) : null;

  return (
    <section>
      <div className={`font-semibold ${theme.bg100}`}>
        <div className='h-[93vh] overflow-x-hidden overflow-y-scroll'>
          <input onChange={(e) => searchChats(e.target.value)} type="search" name="" id="" placeholder={props.chatType === 'group' ? 'Search Group' : 'Search Friend'} className={`mt-2 mx-2 px-4 py-1 w-[95%] rounded-lg ${theme.bg200} font-normal placeholder:text-sm focus:outline-none ${theme.placeholderText400}`} />
          <NavLink to={'/chats/@me'} className={({isActive}) => `flex place-items-center px-2 mx-2 mt-2 mb-1 rounded-lg font-semibold ${theme.text500} ${theme.hoverBg200} ${isActive ? theme.bg200 : null}`}><img src={personIcon} alt="" className={`size-8 m-1 rounded-full ${theme.bg500}`} /><span className='mx-2'>Friends</span></NavLink>
          <NavLink to={'/groups'} className={({isActive}) => `flex place-items-center px-2 mx-2 mb-2 rounded-lg font-semibold ${theme.text500} ${theme.hoverBg200} ${isActive ? theme.bg200 : null}`}><img src={groupIcon} alt="" className={`size-8 m-1 rounded-full ${theme.bg500}`} /><span className='mx-2'>Groups</span></NavLink>
          <hr className={`m-2 border-t ${theme.border300}`} />
          { createGroupButton }
          { chatList }
        </div>
      </div>
      { enableCreateGroupPanel ? <CreateGroup setEnableCreateGroupPanel={setEnableCreateGroupPanel} /> : null }
    </section>
  )
}
