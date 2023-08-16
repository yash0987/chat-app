import React, { useState } from 'react'
import Send from './Send';

export default function SendSection() {
  const [sendRequest, setSendRequest] = useState(null);

  function getSendRequest() {
    async function getData() {
      const getSendRequestListRequestURI = 'http://localhost:5000/friends/request/send';
      const response = await fetch(getSendRequestListRequestURI, {
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
