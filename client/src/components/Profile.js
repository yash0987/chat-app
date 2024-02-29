import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Chatbox from './Chatbox';
import { fetchRequest } from 'utils/fetchRequest';

export default function Profile() {
  const [chatList, setChatList] = useState([]);
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const [openList, setOpenList] = useState(false);
  
  useEffect(() => {
    setChatList([]);
    setOpenList(false);
  }, [newChat.ID]);

  async function commonGroups() {
    if (openList) {
      setChatList([]);
      setOpenList(false);
      return ;
    }
    const commonGroupsListRequestURI = `http://localhost:5000/common/groups/${newChat.ID}`;
    const data = await fetchRequest({ url: commonGroupsListRequestURI, method: 'GET' });
    setChatList(data);
    setOpenList(true);
  }


  return (
    <section>
      <div className={`h-[9rem] p-4 ${theme.bg300}`}>
        <img src={newChat.photoURL} alt="" className='relative -bottom-16 size-24 rounded-full object-cover' />
      </div>
      
      <div className={`m-4 mt-14 p-2 text-xs rounded-lg ${theme.bg50}`}>
        <p className='text-lg font-bold'>{ newChat.fullName }</p>
        <p className='font-semibold'>{ newChat.ID }</p>
        <hr className={`my-4 ${theme.border300}`} />
        <p className='font-semibold'>{ newChat.isGroup ? 'DESCRIPTION' : 'ABOUT ME'}</p>
        <p>This group is for fun and code.</p>
        <hr className={`my-4 ${theme.border300}`} />
        <p className='font-semibold'>CHATME MEMBER SINCE</p>
        <p>date</p>
      </div>

      <div className={`m-4 p-2 text-sm font-semibold rounded-lg ${theme.bg50}`}>
        {
          newChat.isGroup ?
          <button>Group Members</button> :
          <button onClick={() => commonGroups()}>Common Groups</button>
        }

        {
          openList ?
          <div className='m-2 max-h-56 overflow-y-scroll'>
            {
              chatList.map((element) => {
                const route = newChat.isGroup ? `/groups/${element.id}` : `/chats/@me/${element.id}`;
                const chatinfo = { ...element, isGroup: newChat.isGroup };
                return <Chatbox key={element.id} chat={chatinfo} route={route} />
              })
            }
          </div> : null
        }
      </div>
    </section>
  )
}
