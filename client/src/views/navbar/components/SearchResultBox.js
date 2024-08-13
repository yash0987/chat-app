import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserSendRequest } from 'features/auth-slice/authSlice';
import { fetchRequest } from 'utils/fetchRequest';

export default function SearchResultBox(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();
  
  async function AddFriend() {
    const personalId = props.person._id;
    const name = props.person.name;
    const photoURL = props.person.photoURL;
  
    if (user._id === personalId) {
      console.log(`You cannot send request to yourself`);
      return ;
    }
    else if (user.friends.findIndex(element => element._id === personalId) > -1 || user.sendRequests.findIndex(element => element._id === personalId) > -1) {
      console.log(`${name} is already friend`);
      return ;
    }
    
    const addFriendRequestURI = 'http://localhost:5000/add/friend';
    const data = await fetchRequest({ url: addFriendRequestURI, method: 'POST', body: { person: { personalId, name, photoURL } } });
    console.log(data);
    dispatch(setUserSendRequest({personalId, name, photoURL}));
  }

  return (
    <section className={`flex justify-between rounded px-6 py-2 ${theme.hoverBg100}`}>
      <div className='flex'>
        <img src={ props.person.photoURL } alt="" className='w-11 rounded-full' />
        <div className='mx-4'>
          <p>{ props.person.name }</p>
          <p className='text-[10px] text-gray-400'>{ props.person._id }</p>
        </div>
      </div>
      <div>
        <button onClick={ AddFriend } className='mt-[9px] px-3 py-1 text-xs font-semibold rounded border-[1px] border-gray-400 active:bg-gray-200'>Add +</button>
      </div>
    </section>
  )
}
