import React, { useState } from 'react'
import Send from './Send';

export default function SendSection() {
  const [sendRequest, setSendRequest] = useState(null);

  function getSendRequest() {
    async function getData() {
      const response = await fetch('http://localhost:5000/friends/request/send', {
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

    getData().then((data) => setSendRequest(data));
  }

  let keyValue = 0;

  return (
    <div>
      {
        sendRequest ? sendRequest.map((element) => {
            keyValue++;
            return <Send key={keyValue} friendInfo={element} />
        }) : (getSendRequest())
      }
    </div>
  )
}
