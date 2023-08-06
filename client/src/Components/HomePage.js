import React, { useState, useEffect } from 'react';
import FriendSection from './friend-section/FriendSection';
import ChatSection from './chat-section/ChatSection';
import SearchSection from './search-section/SearchSection';
import CurrentUserContext from './../context/CurrentUserContext';
import CreateGroup from './CreateGroup';
import Profile from './Profile';

export default function HomePage() {
  const [toggle, setToggle] = useState('showSearch');
  const [secondPerson, setSecondPerson] = useState({});
  const [oldChatPerson, setOldChatPerson] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auth, setAuth] = useState( { authenticated: false, user: null, error: null } );

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch('http://localhost:5000/user', {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });

      const data = await response.json();
      return data;
    }

    checkAuth().then((data) => {
      setAuth({
        authenticated: true,
        user: data,
        error: null
      })
    })
    .catch(() => {
      setAuth({
        authenticated: false,
        user: null,
        error: "Fail to authenticate"
      })
    });
  }, []);

  return (
    <>
      { 
        auth.authenticated ?
        (<CurrentUserContext>
          <div className={`p-2 flex justify-center rounded bg-violet-100 ${showDeleteModal ? '' : ''}`}>
            {
              toggle === 'showSearch' ? <SearchSection /> : 
              toggle === 'showChatSection' ? <ChatSection oldChatPerson={oldChatPerson} secondPerson={secondPerson} toggle={toggle} setToggle={setToggle} setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} /> :
              toggle === 'showProfile' ? <Profile setToggle={setToggle} secondPerson={secondPerson} /> : 
              <CreateGroup setToggle={setToggle} />
            }
            <FriendSection setOldChatPerson={setOldChatPerson} setSecondPerson={setSecondPerson} secondPerson={secondPerson} setToggle={setToggle} />
          </div>
        </CurrentUserContext>) : null
      }
    </>
  )
}