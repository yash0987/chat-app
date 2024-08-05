import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChatProfile } from 'features/chatinfo-slice/chatInfoSlice';
import { fetchRequest } from 'utils/fetchRequest';

export default function ChatBar(props) {
  const theme = useSelector(state => state.theme.value);
  const chatInfo = useSelector(state => state.chatinfo.value);
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  async function chatProfileDetails() {
    const isGroup = location.pathname.slice(0, 7) === '/groups';
    const chatDetailsURI = isGroup ?
      `http://localhost:5000/groupinfo/${params.id}` :
      `http://localhost:5000/aboutme/${params.id}`;

    const data = await fetchRequest({ url: chatDetailsURI,  method: 'GET' });
    dispatch(setChatProfile(data));
  }

  useEffect(() => {
    chatProfileDetails();
    // eslint-disable-next-line
  }, [params.id]);

  return (
    <section className={`px-8 py-1 relative flex justify-between text-white ${theme.bg400}`}>
      <div className='grid grid-flow-col'>
        <div className='grid grid-flow-col place-items-center'>
          <img src={ chatInfo.photoURL } alt="" className='mx-3 size-8 rounded-full object-cover' />
          <p className='font-semibold'>{ chatInfo.name }</p>
        </div>
      </div>
    </section>
  )
}
