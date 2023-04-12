import React, { useState } from 'react'
import Friend from './Friend';

export default function AllFriendsSection(props) {
  const [friends, setFriends] = useState(null);
  
  function getFriends() {
    async function getData() {
      const response = await fetch('http://localhost:5000/friends/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })

      const data = await response.json();
      return data;
    }

    getData().then((data) => setFriends(data));
  }

  let keyValue = 0;

  return (
    <section>
      {
        friends ? friends.map((element) => {
          keyValue++;
          return <Friend key={keyValue} friendInfo={element} setSecondPerson={props.setSecondPerson} setToggle={props.setToggle} />
        }) : (getFriends())
      }
    </section>
  )
}
