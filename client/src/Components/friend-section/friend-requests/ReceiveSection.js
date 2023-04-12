import React, { useState } from 'react'
import Receive from './Receive';

export default function ReceiveSection() {
  const [receiveRequest, setReceiveRequest] = useState(null);

  function getReceiveRequest() {
    async function getData() {
      const response = await fetch('http://localhost:5000/friends/request/receive', {
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

  let keyValue = 0;

  return (
    <div>
      {
        receiveRequest ? receiveRequest.map((element) => {
            return <Receive key={keyValue} friendInfo={element} />
        }) : (getReceiveRequest())
      }
    </div>
  )
}
