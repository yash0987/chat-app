import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Groups from './Group';
import CreateGroup from './CreateGroup';

export default function GroupSection(props) {
  const [groups, setGroups] = useState(null);
  const [enableCreateGroupPanel, setEnableCreateGroupPanel] = useState(false);
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

  return (
    <>
      <section className='grid grid-flow-col'>
        <div className={`h-[91vh] border-l-[1px] ${theme.borderL700} font-semibold ${theme.bg50}`}>
          <div className='min-w-[27rem]'>
            <input type="search" name="" id="" placeholder='Search Groups' className={`my-4 mx-9 px-5 py-1 w-[85%] rounded-sm ${theme.bg50} border-[1px] border-b-[3px] ${theme.border500} font-normal focus:outline-none ${theme.placeholderText400}`} />
            <button onClick={() => setEnableCreateGroupPanel(true)} className={`p-1 w-full flex justify-center ${theme.text400} ${theme.hoverBg200}`}>
              <p className='p-2'>Create new group</p>
              <span className='text-3xl'>&#43;</span>
            </button>
            {
              groups ? groups.map((element) => {
                keyValue++;
                return <Groups key={keyValue} groupInfo={element} />
              }) : (getGroups())
            }
          </div>
        </div>
      </section>
      { enableCreateGroupPanel ? <CreateGroup setGroups={setGroups} setEnableCreateGroupPanel={setEnableCreateGroupPanel} /> : null }
    </>
  )
}

