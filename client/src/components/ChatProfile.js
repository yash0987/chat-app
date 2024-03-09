import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { dateFromEpoch } from 'utils/dateFromEpoch';
import useFetch from 'hooks/useFetch';
import Chatbox from './Chatbox';

export default function ChatProfile() {
  const [chatList, setChatList] = useState([]);
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const [openList, setOpenList] = useState(false);
  const chatDetailsURI = newChat.isGroup ? `http://localhost:5000/groupinfo/${newChat.ID}` : `http://localhost:5000/aboutme/${newChat.ID}`;
  const chatDetails = useFetch({ url: chatDetailsURI, params: [newChat.ID] })[0];
  
  useEffect(() => {
    setChatList([]);
    setOpenList(false);
  }, [newChat.ID]);

  async function commonGroupsOrMembers() {
    if (openList) {
      setChatList([]);
      setOpenList(false);
      return ;
    }
    const commonGroupsListRequestURI = newChat.isGroup ? 
    `http://localhost:5000/group/members/${newChat.ID}`:
    `http://localhost:5000/common/groups/${newChat.ID}`; 
    const data = await fetchRequest({ url: commonGroupsListRequestURI, method: 'GET' });
    console.log(data);
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
        <p>{ newChat.isGroup ? chatDetails.description : chatDetails.aboutMe }</p>
        <hr className={`my-4 ${theme.border300}`} />
        <p className='font-semibold'>CHATME MEMBER SINCE</p>
        <p>{ dateFromEpoch(chatDetails.doj) }</p>
      </div>

      <div className={`m-4 py-2 text-sm font-semibold rounded-lg ${theme.bg50}`}>
        <button onClick={() => commonGroupsOrMembers()} className='px-2'>{ newChat.isGroup ? 'Group Members' : 'Common Groups' }</button>

        {
          openList ?
          <div className='my-2 max-h-56 overflow-y-scroll'>
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
