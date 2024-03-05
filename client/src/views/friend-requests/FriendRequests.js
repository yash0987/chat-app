import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import RequestBox from 'views/friend-requests/components/RequestBox';
import inboxIcon from 'assets/inboxb.png';
import emptyInbox from 'assets/emptyBox.svg'

export default function FriendRequests() {
  const [requestBlock, setRequestBlock] = useState('receive');
  const [requestsList, setRequestsList] = useState([]);
  const [requestCount, setRequestCount] = useState([0, 0]);
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
      setRequestCount(data.reqCount);
      return data;
    }

    getData().then((data) => setRequestsList(data.reqList));
    // eslint-disable-next-line
  }, [requestBlock])

  const friendsRequestsList = requestsList.length ? requestsList.map((person) => {
      return <RequestBox key={person.id} person={person} requestBlock={requestBlock} requestsList={requestsList} setRequestsList={setRequestsList} setRequestCount={setRequestCount} />
    }) :
    <div className='grid place-items-center first-line:font-semibold '>
      <img src={emptyInbox} alt="" className='w-52 py-3' />
      <p className='font-semibold'>Nothing here yet</p>
      <p className='text-sm'>You don't have any friend request</p>
    </div>

  return (
    <section className={`w-[30rem] absolute top-10 right-20 z-10 rounded-lg border-[1px] ${theme.border300} ${theme.bg50}`}>
      <div className={`p-3 rounded-t-lg ${theme.bg100}`}>
        <div className='grid grid-flow-col place-content-start'>
          <img src={inboxIcon} alt="" className='size-8 inline-block' />
          <span className='text-lg font-semibold'>Inbox</span>
        </div>

        <div className='font-semibold'>
          <button onClick={() => setRequestBlock('receive')} id="receiveBtn" className={`m-2 px-2 rounded ${theme.text600} ${theme.bg200}`}>
            Receive
            { requestCount[0] ? <p className={`inline-block ml-2 px-1 leading-[18px] text-sm rounded-full ${theme.bg300}`}>{ requestCount[0] }</p> : null }
          </button>
          <button onClick={() => setRequestBlock('send')} id="sendBtn" className={`m-2 px-2 rounded ${theme.text600} ${theme.bg200}`}>
            Send
            { requestCount[1] ? <p className={`inline-block ml-2 px-1 leading-[18px] text-sm rounded-full ${theme.bg300}`}>{ requestCount[1] }</p> : null }
          </button>
        </div>
      </div>

      <div className='py-2 h-[15rem] overflow-y-scroll'>{ friendsRequestsList }</div>
    </section>
  )
}
