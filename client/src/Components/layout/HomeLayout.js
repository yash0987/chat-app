import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../features/auth-slice/authSlice';
import Navbar from '../Navbar';
import SideBar from '../sidebar/SideBar';
import PinBar from '../PinBar';

export default function HomeLayout() {
  const [latestChat, setLatestChat] = useState({});
  const [newChat, setNewChat] = useState({});
  const [settingToggle, setSettingToggle] = useState(false);
  const theme = useSelector(state => state.theme.value);
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

  console.log()

  return (
    auth.authenticated ?
    (<div className={`w-screen h-screen ${theme.bg100}`}>
      <Navbar setSettingToggle={setSettingToggle} />
      <div className='grid grid-flow-col justify-end'>
        <Outlet context={{ newChat, setNewChat, latestChat, setLatestChat }} />
        <PinBar />
      </div>
      <SideBar settingToggle={settingToggle} setSettingToggle={setSettingToggle} />
    </div>) : null
  )
}
