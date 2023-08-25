import React, { useState, useRef, useEffect } from 'react';
import searchIcon from '../../img/searchBlack.png'
import SearchedPerson from './SearchedPerson';

export default function SearchSection() {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  async function usersRecord(searchData) {
    const searchUserRequestURI = `http://localhost:5000/search/user?search=${searchData}`;
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
    setSearchedUsers(data.record);
  }
  
  function searchFriends() {
    setTimeout(() => {        
      let searchData = searchRef.current.value;
      searchData = searchData.trim().toLowerCase();

      if (searchData !== "") usersRecord(searchData);
      else setSearchedUsers([]);
    }, 100);
  }

  return (
    <div className='absolute top-0  w-screen h-screen bg-black bg-opacity-20'>
      <div className='w-1/2 p-3 origin-center translate-x-[50%] rounded-lg bg-violet-50 border-[1px] border-violet-500'>
        <label className='col-span-4 flex rounded-md border-2 border-violet-700 bg-violet-50'>
          <img src={searchIcon} alt="" className='w-8 rounded-l-md bg-violet-100' />
          <input type="text" onChange={ () => searchFriends() } ref={searchRef} id="searchBox" autoComplete='off' placeholder='Search new friends' className='p-1 w-full rounded-r-md bg-violet-100 focus:outline-none placeholder:text-violet-400' />
        </label>
        <div id="searchResult" className='mt-3 w-full max-h-80 overflow-y-scroll'>{
          searchedUsers.map((person) => <SearchedPerson person={person} />)
        }</div>
      </div>
    </div>
  )
}
