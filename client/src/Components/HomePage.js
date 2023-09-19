import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../features/auth-slice/authSlice';
import Navbar from './Navbar';
import FriendSection from './friend-section/FriendSection';
import ChatSection from './chat-section/ChatSection';
import CreateGroup from './CreateGroup';
import Profile from './Profile';
import DefaultPage from './DefaultPage';
import SideBar from './sidebar/SideBar';

export default function HomePage() {
  const [toggle, setToggle] = useState('showSearch');
  const [secondPerson, setSecondPerson] = useState({});
  const [oldChatPerson, setOldChatPerson] = useState({});
  const [settingToggle, setSettingToggle] = useState(false);
  const auth = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuth() {
      const getUserRequestURI = 'http://localhost:5000/user';
      const response = await fetch(getUserRequestURI, {
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
      dispatch(setAuth({
        authenticated: true,
        user: data,
        error: null
      }))
    })
    .catch(() => {
      dispatch(setAuth({
        authenticated: false,
        user: null,
        error: "Fail to authenticate"
      }))
    });
    // eslint-disable-next-line
  }, []);

  return (
    auth.authenticated ?
    (<div className='w-screen h-screen bg-violet-100'>
      <Navbar setSettingToggle={setSettingToggle} />
      <div className={`grid grid-cols-3 grid-rows-1 bg-violet-100`}>
        {
          toggle === 'showChatSection' ? <ChatSection oldChatPerson={oldChatPerson} secondPerson={secondPerson} toggle={toggle} setToggle={setToggle} /> :
          toggle === 'showProfile' ? <Profile setToggle={setToggle} secondPerson={secondPerson} /> :
          toggle ==='showCreateGroup' ? <CreateGroup setToggle={setToggle} /> :
          <DefaultPage />
        }
        <FriendSection setOldChatPerson={setOldChatPerson} setSecondPerson={setSecondPerson} secondPerson={secondPerson} setToggle={setToggle} />
        <SideBar settingToggle={settingToggle} setSettingToggle={setSettingToggle} />
      </div>
    </div>) : null
  )
}