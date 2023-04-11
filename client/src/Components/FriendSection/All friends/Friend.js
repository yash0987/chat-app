import React from 'react';

export default function Friend(props) {
  function openChat(event) {
    const ID = event.target.parentElement.previousElementSibling.lastElementChild.lastElementChild.textContent;
    const fullName = event.target.parentElement.previousElementSibling.lastElementChild.firstElementChild.textContent;
    const photoURL = event.target.parentElement.previousElementSibling.firstElementChild.getAttribute('src');
    props.setSecondPerson( { ID, fullName, photoURL } )
    props.setToggle('showChatSection');
  }

  return (
    <section className='flex justify-between mx-1 px-6 py-2 rounded-lg font-semibold hover:bg-violet-100'>
        <div className='flex'>
            <img src={props.friendInfo.photoURL} alt="" className='w-10 rounded-full' />
            <div className='mx-4'>
              <p>{ props.friendInfo.fullName }</p>
              <p className='text-[10px] text-gray-400'>{ props.friendInfo.googleID }</p>
            </div>
        </div>
        <div>
            <button onClick={openChat} className='my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Message</button>
        </div>
    </section>
  )
}
