import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from 'features/auth-slice/authSlice';
import { selectTheme } from 'features/theme-slice/themeSlice';
import { themes } from 'data/ThemesColors';
import Navbar from 'views/navbar/Navbar';
import SideBar from 'views/sidebar/SideBar';
import PinBar from 'views/pinbar/PinBar';

export default function HomeLayout() {
  const [settingToggle, setSettingToggle] = useState(false);
  const auth = useSelector((state) => state.auth.value);
  const theme = useSelector(state => state.theme.value);
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
      dispatch(selectTheme(themes[data.theme]))
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
    (<div className={`flex flex-col h-screen ${theme.bg100}`}>
      <Navbar setSettingToggle={setSettingToggle} />
      <div className='flex-1 inline-grid grid-flow-col'>
        <PinBar />
        <Outlet />
      </div>
      <SideBar settingToggle={settingToggle} setSettingToggle={setSettingToggle} />
    </div>) : null
  )
}
