import React, { createContext, useState, useContext, useMemo } from 'react';

const currentUser = createContext(null);

export default function CurrentUserContext({ children }) {
  const [user, setUser] = useState({});
  useMemo(() => {
    async function getData() {
      const response = await fetch('http://localhost:5000/user',
        { 
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        }
      });
      const data = await response.json();
      setUser(data);
      return data;
    }

    getData();
  }, []);

  return (
    <div>
      <currentUser.Provider value={user}>
        {children}
      </currentUser.Provider>
    </div>
  )
}

export function CurrentUser() {
  return useContext(currentUser);
}