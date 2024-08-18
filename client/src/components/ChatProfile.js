import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { dateFromEpoch } from 'utils/dateFromEpoch';

export default function ChatProfile() {
  const [chatList, setChatList] = useState([]);
  const [openList, setOpenList] = useState(false);
  const theme = useSelector(state => state.theme.value);
  const chatInfo = useSelector(state => state.chatinfo.value);
  const location = useLocation();

  const chatType = location.pathname.slice(0, 7) === '/groups';

  useEffect(() => {
    setChatList([]);
    setOpenList(false);
  }, [chatInfo._id]);

  async function commonGroupsOrMembers() {
    if (openList) {
      setChatList([]);
      setOpenList(false);
      return ;
    }
    const commonGroupsListRequestURI = chatType === 'group' ? 
      `http://localhost:5000/group/members/${chatInfo._id}`:
      `http://localhost:5000/common/groups/${chatInfo._id}`; 
    const data = await fetchRequest({ url: commonGroupsListRequestURI, method: 'GET' });
    console.log(data);
    setChatList(data);
    setOpenList(true);
  }

  return (
    <section>
      <div className={`h-[9rem] p-4 ${theme.bg300}`}>
        <img src={chatInfo.photoURL} alt="" className='relative -bottom-16 size-24 rounded-full object-cover' />
      </div>
      
      <div className={`m-4 mt-14 p-2 text-xs rounded-lg ${theme.bg50}`}>
        <p className='text-lg font-bold'>{ chatInfo.name }</p>
        <p className='font-semibold'>{ chatInfo._id }</p>
        <hr className={`my-4 ${theme.border300}`} />
        <p className='font-semibold'>{ chatType === 'group' ? 'DESCRIPTION' : 'ABOUT ME'}</p>
        <p>{ location.pathname.slice(0, 7) === '/groups' ? chatInfo.description : chatInfo.aboutMe }</p>
        <hr className={`my-4 ${theme.border300}`} />
        <p className='font-semibold'>CHATME MEMBER SINCE</p>
        <p>{ dateFromEpoch(chatInfo.doj) }</p>
      </div>

      <div className={`m-4 py-2 text-sm font-semibold rounded-lg ${theme.bg50}`}>
        <button onClick={() => commonGroupsOrMembers()} className='px-2'>{ chatType === 'group' ? 'Group Members' : 'Common Groups' }</button>

        {
          openList ?
          <div className='my-2 max-h-56 overflow-y-scroll'>
            {
              chatList.map((chat) => {
                return <div key={chat._id} className={`flex justify-between mx-2 p-2 rounded-lg font-semibold ${theme.hoverBg200}`}>
                <div className='grid grid-flow-col'>
                  <img src={ chat.photoURL } alt="" className='size-10 rounded-full object-cover' />
                  <div className='mx-4'>
                    <p>{ chat.name }</p>
                    <p className='text-[10px] text-gray-400'>{ chat._id }</p>
                  </div>
                </div>
              </div>
              })
            }
          </div> : null
        }
      </div>
    </section>
  )
}
