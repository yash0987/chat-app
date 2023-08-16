import React from 'react'

export default function Receive(props) {
  async function acceptFriendRequest(event) {
    let targetedElement = event.target.parentElement.previousElementSibling;
    const ID = targetedElement.lastElementChild.lastElementChild.textContent;
    const fullName = targetedElement.lastElementChild.firstElementChild.textContent;
    const photoURL = targetedElement.firstElementChild.firstElementChild.getAttribute('src');
    event.target.parentElement.parentElement.remove();
    
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
    let targetedElement = event.target.parentElement.previousElementSibling;
    const ID = targetedElement.lastElementChild.lastElementChild.textContent;
    const fullName = targetedElement.lastElementChild.firstElementChild.textContent;
    const photoURL = targetedElement.firstElementChild.firstElementChild.getAttribute('src');
    event.target.parentElement.parentElement.remove();
    
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
    <section className='flex justify-between mx-1 px-6 py-2 rounded-lg hover:bg-violet-100'>
        <div className='flex'>
            <div>
              <img src={props.friendInfo.photoURL} alt="" className='w-10 rounded-full' />
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