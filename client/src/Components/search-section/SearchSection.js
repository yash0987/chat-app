import React, { useState, useRef } from 'react';
import { CurrentUser } from '../../context/CurrentUserContext';

export default function SearchSection() {
  const users = CurrentUser();
  const [record, setRecord] = useState([]);
  const [elementArray, setElementArray] = useState([]);
  const searchRef = useRef(null);

  async function AddFriend(event) {
    const ID = event.target.parentElement.previousElementSibling.lastElementChild.lastElementChild.textContent;
    const name = event.target.parentElement.previousElementSibling.lastElementChild.firstElementChild.textContent;
    const ImgURL = event.target.parentElement.previousElementSibling.firstElementChild.getAttribute('src');

    if (users.friendsID.findIndex(element => element.googleID === ID) > -1 || users.sendRequestID.findIndex(element => element.googleID === ID) > -1) {
      console.log(`${name} is already friend`);
      return ;
    }

    const response = await fetch(`http://localhost:5000/add/friend?ID=${ID}&fullName=${name}&photoURL=${ImgURL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    });

    const data = await response.json();
    console.log(data);
  }

  async function usersRecord() {
    const response = await fetch('http://localhost:5000/search/user', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    
    const data = await response.json();
    setRecord(data);
  }
  
  function searchFriends() {
    setTimeout(() => {        
      let searchData = searchRef.current.value;
      searchData = searchData.trim().toLowerCase();
      
      let searchedUserArray = [];
      usersRecord();

      if (searchData !== "") {
        console.log(record);
        record.forEach((element) => {
          const userFullName = (element.firstName + " " + element.familyName).toLowerCase();
          console.log(userFullName, searchData);

          if (userFullName.includes(searchData)) {
            const searchedUser = (
              <section className='flex justify-between rounded px-6 py-2 hover:bg-violet-100'>
                <div className='flex'>
                  <img src={ element.photoURL } alt="" className='w-11 rounded-full' />
                  <div className='mx-4'>
                    <p>{ element.firstName + " " + element.familyName }</p>
                    <p className='text-[10px] text-gray-400'>{ element.googleID }</p>
                  </div>
                </div>
                <div>
                  <button onClick={ AddFriend } className='mt-[9px] px-3 py-1 text-xs font-semibold rounded border-[1px] border-gray-400 active:bg-gray-200'>Add +</button>
                </div>
              </section>
            );

            searchedUserArray.push(searchedUser);
          }
        });

        setElementArray(searchedUserArray);
      }
    }, 100);
  }

  return (
    <section className='m-2 rounded bg-violet-50'>
      <input type="text" onKeyUp={ searchFriends } ref={searchRef} id="searchBox" placeholder='Search friends' className='m-6 px-5 py-3 w-[20rem] rounded-full bg-violet-100 focus:outline-none placeholder:text-violet-400' />
      <div id="searchResult" className='my-3'> { elementArray } </div>
    </section>
  )
}
