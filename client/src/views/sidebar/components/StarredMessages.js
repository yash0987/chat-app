import React from 'react';
import useFetch from 'hooks/useFetch';
import StarredMessageBox from './StarredMessageBox';

export default function StarredMessages() {  
  const starredMessageURL = `http://localhost:5000/starred/messages?range=${40}`;
  const starredMessageList = useFetch({ url: starredMessageURL })[0];

  return (
    <div>
      <p className='text-xl font-semibold'>Starred Messages</p>
      <div> {
        starredMessageList.map((element) => {
          return <StarredMessageBox key={element.messageID} element={element} />
        })
      } </div>
    </div>
  )
}
