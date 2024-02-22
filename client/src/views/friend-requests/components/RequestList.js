import React, { useState, useEffect } from 'react';
import RequestBox from './RequestBox';

export default function RequestsList(props) {
  const [requestsList, setRequestsList] = useState([]);

  useEffect(() => {
    async function getData() {
      const receivedRequestURI = 'http://localhost:5000/friends/request/receive';
      const sentRequestURI = 'http://localhost:5000/friends/request/send';
      const requestListURI = props.requestBlock === 'receive' ? receivedRequestURI : sentRequestURI;
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
  }, [])

  return (
    <div>
      {
        requestsList ? requestsList.map((person, index) => {
          return <RequestBox key={person.id} person={person} requestBlock={props.requestBlock} setRequestsList={setRequestsList} />
        }) : null
      }
    </div>
  )
}
