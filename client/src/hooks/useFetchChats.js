import { useDispatch } from 'react-redux';

export default function useFetchChats({ url, callback }) {
  const dispatch = useDispatch();
  return async () => {
    const response = await fetch(url, {
      method: 'GET',
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });
    
    const data = await response.json();
    dispatch(callback(data))
  }
}
