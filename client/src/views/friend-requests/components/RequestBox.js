import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserFriends, removeReceiveRequest, removeSendRequest } from 'features/auth-slice/authSlice';
import { fetchRequest } from 'utils/fetchRequest';

export default function RequestBox(props) {
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();
  const declineFriendRequestURI = 'http://localhost:5000/declineRequest';
  const acceptFriendRequestURI = 'http://localhost:5000/acceptRequest';
  const cancelFriendRequestURI = 'http://localhost:5000/cancelRequest';

  async function handleFriendRequest(url, action) {
    const data = await fetchRequest({ url: url , method: 'PUT', body: { person: props.person } });
    dispatch(removeReceiveRequest(props.person));
    dispatch(removeSendRequest(props.person));
    if (action === 'accept') dispatch(setUserFriends(props.person));
    props.setRequestsList(prevState => prevState.filter((person) => person._id !== props.person._id));
    props.setRequestCount(prevState => {
      return props.requestBlock === 'receive' ? [prevState[0] - 1, prevState[1]] : [prevState[0], prevState[1] - 1];
    })
    console.log(data);
  }
  
  return (
    <div className={`flex justify-between mx-2 p-2 rounded-lg font-semibold ${theme.hoverBg100}`}>
      <div className='grid grid-flow-col'>
        <img src={ props.person.photoURL } alt="" className='size-10 rounded-full object-cover' />
        <div className='mx-4'>
          <p>{ props.person.name }</p>
          <p className='text-[10px] text-gray-400'>{ props.person._id }</p>
        </div>
      </div>

      {
        props.requestBlock === 'receive' ?
        <div className='flex'>
          <button onClick={() => handleFriendRequest(acceptFriendRequestURI, 'accept')} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Accept</button>
          <button onClick={() => handleFriendRequest(declineFriendRequestURI, 'decline')} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Decline</button>
        </div> 
        :
        <div>
          <button onClick={() => handleFriendRequest(cancelFriendRequestURI, 'cancel')} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Cancel</button>
        </div>
      }
    </div>
  )
}