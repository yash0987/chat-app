import React, { useState } from 'react'
import Groups from './Group';

export default function GroupSection(props) {
  const [groups, setGroups] = useState(null);
  let keyValue = 0;

  function getGroups() {
    async function getData() {
      const response = await fetch('http://localhost:5000/groups/list', {
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

    getData().then((data) => {
      setGroups(data);
    })
  }

  function createGroupComp() {
    props.setToggle('showCreateGroup');
  }

  return (
    <section>
      <button onClick={createGroupComp} className='p-1 w-full flex justify-center text-violet-400 hover:bg-violet-200'>
        <p className='p-2'>Create new group</p>
        <span className='text-3xl'>&#43;</span>
      </button>

      {
        groups? groups.map((element) => {
          keyValue++;
          return <Groups key={keyValue} GroupInfo={element} />
        }) : (getGroups())
      }
    </section>
  )
}

