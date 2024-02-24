import React from 'react';
import RequestBox from 'views/friend-requests/components/RequestBox';
import useFetch from 'hooks/useFetch';

export default function RequestsList(props) {
  const receivedRequestURI = 'http://localhost:5000/friends/request/receive';
  const sentRequestURI = 'http://localhost:5000/friends/request/send';
  const requestListURI = props.requestBlock === 'receive' ? receivedRequestURI : sentRequestURI;
  const [requestsList, setRequestsList] = useFetch(requestListURI);

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
