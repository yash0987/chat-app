import React, { useState } from 'react'
import Groups from './Group';
import { useSelector } from 'react-redux';

export default function GroupSection(props) {
  const [groups, setGroups] = useState(null);
  const theme = useSelector(state => state.theme.value);
  let keyValue = 0;

  function getGroups() {
    async function getData() {
      const getGroupListRequestURI = 'http://localhost:5000/groups/list'
      const response = await fetch(getGroupListRequestURI, {
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
      <button onClick={createGroupComp} className={`p-1 w-full flex justify-center ${theme.text400} ${theme.hoverBg200}`}>
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

