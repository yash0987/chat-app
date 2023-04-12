import React, { useState } from 'react';
import ReceiveSection from './ReceiveSection';
import SendSection from './SendSection';

export default function FriendRequests() {
  const [requestBlock, setRequestBlock] = useState('receive');

  function setReceiveRequestList(event) {
    event.target.className = ' border-b-2 border-violet-500 mx-1 py-2 w-44 text-violet-600';
    event.target.nextElementSibling.className = 'mx-1 py-2 w-44 text-violet-400';
    setRequestBlock('receive');
  }

  function setSendRequestList(event) {
    event.target.previousElementSibling.className = 'mx-1 py-2 w-44 text-violet-400';
    event.target.className = 'border-b-2 border-violet-500 mx-1 py-2 w-44 text-violet-600';
    setRequestBlock('send');
  }

  return (
    <section>
      <div className='flex justify-center my-4'>
        <button onClick={setReceiveRequestList} id="receiveBtn" className='mx-1 py-2 w-44 text-violet-600 border-b-2 border-violet-500'>Receive</button>
        <button onClick={setSendRequestList} id="sendBtn" className='mx-1 py-2 w-44 text-violet-400'>Send</button>
      </div>
      <div>
        {
          requestBlock === 'receive' ? <ReceiveSection /> : <SendSection />
        }
      </div>
    </section>
  )
}
