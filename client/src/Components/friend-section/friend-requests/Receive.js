import React from 'react'
import { useSelector } from 'react-redux';

export default function Receive(props) {
  const theme = useSelector(state => state.theme.value);
  
  async function acceptFriendRequest(event) {
    const ID = props.friendInfo.googleID;
    const fullName = props.friendInfo.fullName;
    const photoURL = props.friendInfo.photoURL;
    props.setReceiveRequest(props.receiveRequest.filter((element) => element.googleID !== ID));
    
    const acceptFriendRequestURI = `http://localhost:5000/acceptRequest?ID=${ID}&fullName=${fullName}&photoURL=${photoURL}`;
    const response = await fetch(acceptFriendRequestURI, {
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

  async function declineFriendRequest(event) {
    const ID = props.friendInfo.googleID;
    const fullName = props.friendInfo.fullName;
    const photoURL = props.friendInfo.photoURL;
    props.setReceiveRequest(props.receiveRequest.filter((element) => element.googleID !== ID));
    
    const declineFriendRequestURI = `http://localhost:5000/declineRequest?ID=${ID}&fullName=${fullName}&photoURL=${photoURL}`;
    const response = await fetch(declineFriendRequestURI, {
      method: 'DELETE',
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
    <section className={`flex justify-between mx-1 px-6 py-2 rounded-lg ${theme.hoverBg100}`}>
      <div className='flex'>
          <div>
            <img src={ props.friendInfo.photoURL } alt="" className='w-10 rounded-full' />
          </div>
          <div className='mx-4'>
            <p>{ props.friendInfo.fullName }</p>
            <p className='text-[10px] text-gray-400'>{ props.friendInfo.googleID }</p>
          </div>
      </div>
      <div className='flex'>
          <button onClick={acceptFriendRequest} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Accept</button>
          <button onClick={declineFriendRequest} className='mx-1 my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Decline</button>
      </div>
    </section>
  )
}