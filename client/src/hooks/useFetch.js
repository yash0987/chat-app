import { useState, useEffect } from 'react';

export default function useFetch({ url, params=[] }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });

      const json = await response.json();
      setData(json);
    })()
    // eslint-disable-next-line
  }, [...params])

  return [data, setData];
}
