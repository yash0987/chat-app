import React, { useState } from 'react';

export default function Profile(props) {
  const [friendInfo, setFriendInfo] = useState(null);

  function getFriendInfo() {
    console.log(props.secondPerson);
    async function getData() {
      const friendDataRequestURI = `http://localhost:5000/friend/data/${props.secondPerson.ID}`;
      const response = await fetch(friendDataRequestURI, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });

      const data = await response.json();
      return data;
    }

    getData().then((data) => setFriendInfo(data));
  }

  async function unfriend() {
    const unfriendRequestURI = `http://localhost:5000/unfriend/${friendInfo.googleID}`;
    const response = await fetch(unfriendRequestURI, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });

    const data = response.json();
    console.log(data);
    props.setToggle('showSearch');
  }

  async function commonGroups() {
    async function getData() {
      const commonGroupsListRequestURI = `http://localhost:5000/friend/groups/${friendInfo.googleID}`;
      const response = await fetch(commonGroupsListRequestURI, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });

      const data = await response.json();
      return data;
    }

    getData().then((data) => console.log(data));
  }

  return (
    <section className='m-2 p-5 w-[45rem] rounded bg-violet-50'>
      {
        friendInfo ?
        (<div>
          <div className='m-5 flex justify-center'>
            <img src={props.secondPerson.photoURL} alt="" id='selectedProfileImage' className='w-36 h-36 rounded-full object-cover' />
          </div>

          <div className='my-5'>
            <p className='flex justify-center text-2xl font-semibold'>{ friendInfo.firstName + " " + friendInfo.familyName }</p>
            <p className='flex justify-center text-sm'>{ friendInfo.googleID }</p>
          </div>

          <div className='flex justify-center'>
            <button onClick={unfriend} className='px-4 py-2 rounded text-red-500 font-semibold hover:bg-red-100'>Unfriend</button>
            <button onClick={commonGroups} className='px-4 py-2 rounded text-violet-500 font-semibold hover:bg-violet-100'>Block</button>
          </div>
        </div>) : (getFriendInfo())
      }
    </section>
  )
}
