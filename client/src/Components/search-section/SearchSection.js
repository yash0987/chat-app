import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import searchLogo from '../../img/searchBlack.png'

export default function SearchSection() {
  const user = useSelector(state => state.auth.value.user);
  const [record, setRecord] = useState([]);
  const [elementArray, setElementArray] = useState([]);
  const searchRef = useRef(null);

  async function AddFriend(event) {
    const ID = event.target.parentElement.previousElementSibling.lastElementChild.lastElementChild.textContent;
    const name = event.target.parentElement.previousElementSibling.lastElementChild.firstElementChild.textContent;
    const ImgURL = event.target.parentElement.previousElementSibling.firstElementChild.getAttribute('src');

    if (user.friendsID.findIndex(element => element.googleID === ID) > -1 || user.sendRequestID.findIndex(element => element.googleID === ID) > -1) {
      console.log(`${name} is already friend`);
      return ;
    }

    if (user.googleID === ID) {
      console.log(`You cannot send request to yourself`);
      return ;
    }

    const addFriendRequestURI = `http://localhost:5000/add/friend?ID=${ID}&fullName=${name}&photoURL=${ImgURL}`;
    const response = await fetch(addFriendRequestURI, {
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
    const searchUserRequestURI = 'http://localhost:5000/search/user';
    const response = await fetch(searchUserRequestURI, { 
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
    <div className='absolute top-0  w-screen h-screen bg-black bg-opacity-20'>
      <div className='w-1/2 p-3 origin-center translate-x-[50%] rounded-lg bg-violet-50 border-[1px] border-violet-500'>
        <label className='col-span-4 flex rounded-md border-2 border-violet-700 bg-violet-50'>
          <img src={searchLogo} alt="" className='w-8 rounded-l-md bg-violet-100' />
          <input type="text" onKeyUp={ searchFriends } ref={searchRef} id="searchBox" autoComplete='off' placeholder='Search new friends' className='p-1 w-full rounded-r-md bg-violet-100 focus:outline-none placeholder:text-violet-400' />
        </label>
        <div id="searchResult" className='mt-3 w-full max-h-80 overflow-y-scroll'> { elementArray } </div>
      </div>
    </div>
  )
}
