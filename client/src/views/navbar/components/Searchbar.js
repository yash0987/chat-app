import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SearchResultBox from 'views/navbar/components/SearchResultBox';
import searchIcon from 'assets/searchBlack.png';
import { fetchRequest } from 'utils/fetchRequest';

export default function Searchbar() {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const searchRef = useRef(null);
  const theme = useSelector(state => state.theme.value);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  async function usersRecord(search) {
    const searchUserRequestURI = `http://localhost:5000/search/user?search=${search}`;
    const data = await fetchRequest({ url: searchUserRequestURI, method: 'GET', body: { search } });
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
    <div className='absolute top-0 z-10 w-screen h-screen bg-black bg-opacity-20'>
      <div className={`w-1/2 p-3 origin-center translate-x-[50%] rounded-lg ${theme.bg50} border-[1px] ${theme.border500}`}>
        <label className={`col-span-4 flex rounded-md border-2 ${theme.border700} ${theme.bg50}`}>
          <img src={searchIcon} alt="" className={`w-8 rounded-l-md ${theme.bg100}`} />
          <input type="text" onChange={ () => searchFriends() } ref={searchRef} id="searchBox" autoComplete='off' placeholder='Search new friends' className={`p-1 w-full rounded-r-md ${theme.bg100} focus:outline-none ${theme.placeholderText400}`} />
        </label>
        <div id="searchResult" className='mt-3 w-full max-h-80 overflow-y-scroll'>{
          searchedUsers.map((person) => <SearchResultBox key={person._id} person={person} />)
        }</div>
      </div>
    </div>
  )
}
