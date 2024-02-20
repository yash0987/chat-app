import React, { useState } from 'react'
import Receive from './Receive';

export default function ReceiveSection() {
  const [receiveRequest, setReceiveRequest] = useState(null);

  function getReceiveRequest() {
    async function getData() {
      const getReceiveRequestListRequestURI = 'http://localhost:5000/friends/request/receive';
      const response = await fetch(getReceiveRequestListRequestURI, {
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

    getData().then((data) => setReceiveRequest(data));
  }

  return (
    <div>
      {
        receiveRequest ? receiveRequest.map((element, index) => {
            return <Receive key={index} friendInfo={element} receiveRequest={receiveRequest} setReceiveRequest={setReceiveRequest} />
        }) : (getReceiveRequest())
      }
    </div>
  )
}
