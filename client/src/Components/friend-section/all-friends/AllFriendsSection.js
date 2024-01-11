import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Friend from './Friend';

export default function AllFriendsSection(props) {
  const [friends, setFriends] = useState(null);
  const theme = useSelector(state => state.theme.value);

  function getFriends() {
    async function getData() {
      const friendListRequestURI = 'http://localhost:5000/friends/list';
      const response = await fetch(friendListRequestURI, {
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
    <section className='grid grid-flow-col'>
      <div className={`h-[91vh] border-l-[1px] ${theme.borderL700} font-semibold ${theme.bg50}`}>
        <div className='min-w-[27rem]'>
        <input type="search" name="" id="" placeholder='Search friends' className={`my-4 mx-9 px-5 py-1 w-[85%] rounded-sm ${theme.bg50} border-[1px] border-b-[3px] ${theme.border500} font-normal focus:outline-none ${theme.placeholderText400}`} />
        {
          friends ? friends.map((element) => {
            keyValue++;
            return <Friend key={keyValue} friendInfo={element} newChat={props.newChat} setNewChat={props.setNewChat} latestChat={props.latestChat} setLatestChat={props.setLatestChat} />
          }) : (getFriends())
        }
        </div>
      </div>
    </section>
  )
}
