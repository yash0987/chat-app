import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import RequestBox from './components/RequestBox';

export default function FriendRequests() {
  const [requestBlock, setRequestBlock] = useState('receive');
  const [requestsList, setRequestsList] = useState(null);
  const theme = useSelector(state => state.theme.value);

  useEffect(() => {
    async function getData() {
      const receivedRequestURI = 'http://localhost:5000/friends/request/receive';
      const sentRequestURI = 'http://localhost:5000/friends/request/send';
      const requestListURI = requestBlock === 'receive' ? receivedRequestURI : sentRequestURI;
      const response = await fetch(requestListURI, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });

      const data = await response.json();
      return data;
    }

    getData().then((data) => setRequestsList(data));
    // eslint-disable-next-line
  }, [requestBlock])

  const friendsRequestsList = requestsList ? requestsList.map((person) => {
    return <RequestBox key={person.id} person={person} requestBlock={requestBlock} requestsList={requestsList} setRequestsList={setRequestsList} />
  }) : null

  return (
    <section>
      <div className='flex justify-center my-4'>
        <button onClick={() => setRequestBlock('receive')} id="receiveBtn" className={`${requestBlock === 'receive' ? `border-b-2 ${theme.border500} ${theme.text600}`: `${theme.text400}` } mx-1 py-2 w-44`}>Receive</button>
        <button onClick={() => setRequestBlock('send')} id="sendBtn" className={`${requestBlock === 'send' ? `border-b-2 ${theme.border500} ${theme.text600}`: `${theme.text400}` } mx-1 py-2 w-44`}>Send</button>
      </div>
      <div>{ friendsRequestsList }</div>
    </section>
  )
}
