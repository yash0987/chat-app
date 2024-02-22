import React from 'react';
import { useSelector } from 'react-redux';

export default function RequestBox(props) {
  const theme = useSelector(state => state.theme.value);
  const declineFriendRequestURI = `http://localhost:5000/declineRequest?person=${JSON.stringify(props.person)}`;
  const acceptFriendRequestURI = `http://localhost:5000/acceptRequest?person=${JSON.stringify(props.person)}`;
  const cancelFriendRequestURI = `http://localhost:5000/cancelRequest?person=${JSON.stringify(props.person)}`;

  async function handleFriendRequest(uri) {
    props.setRequestsList(prevState => prevState.filter((person) => person.id !== props.person.id));

    const response = await fetch(uri, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });
    
    const data = await response.json();
    console.log(data);
  }
  
  return (
    <div className={`flex justify-between mx-2 px-6 py-2 rounded-lg font-semibold ${theme.hoverBg100}`}>
      <div className='grid grid-flow-col'>
        <img src={ props.person.photoURL } alt="" className='size-10 rounded-full object-cover' />
        <div className='mx-4'>
          <p>{ props.person.name }</p>
          <p className='text-[10px] text-gray-400'>{ props.person.id }</p>
        </div>
      </div>

      {
        props.requestBlock === 'receive' ?
        <div className='flex'>
          <button onClick={() => handleFriendRequest(acceptFriendRequestURI)} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Accept</button>
          <button onClick={() => handleFriendRequest(declineFriendRequestURI)} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Decline</button>
        </div> 
        :
        <div>
          <button onClick={() => handleFriendRequest(cancelFriendRequestURI)} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Cancel</button>
        </div>
      }
    </div>
  )
}