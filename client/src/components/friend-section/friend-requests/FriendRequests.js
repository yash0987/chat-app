import React, { useState } from 'react';
import ReceiveSection from './ReceiveSection';
import SendSection from './SendSection';
import { useSelector } from 'react-redux';

export default function FriendRequests() {
  const [requestBlock, setRequestBlock] = useState('receive');
  const theme = useSelector(state => state.theme.value);

  return (
    <section>
      <div className='flex justify-center my-4'>
        <button onClick={() => setRequestBlock('receive')} id="receiveBtn" className={`${requestBlock === 'receive' ? `border-b-2 ${theme.border500} ${theme.text600}`: `${theme.text400}` } mx-1 py-2 w-44`}>Receive</button>
        <button onClick={() => setRequestBlock('send')} id="sendBtn" className={`${requestBlock === 'send' ? `border-b-2 ${theme.border500} ${theme.text600}`: `${theme.text400}` } mx-1 py-2 w-44`}>Send</button>
      </div>
      <div>{ requestBlock === 'receive' ? <ReceiveSection /> : <SendSection /> }</div>
    </section>
  )
}
