import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import wumpus1 from 'assets/wumpus1.gif';
import wumpus2 from 'assets/wumpus2.gif';
import wumpus3 from 'assets/wumpus3.gif';
import wumpus4 from 'assets/wumpus4.gif';
import wumpus5 from 'assets/wumpus5.gif';
import wumpus6 from 'assets/wumpus6.gif';
export default function DefaultPage() {
  const theme = useSelector(state => state.theme.value);
  const wumpus = [ wumpus1, wumpus2, wumpus3, wumpus4, wumpus5, wumpus6 ];
  const [random, setRandom] = useState(0);

  useEffect(() => {
    const number = Math.floor(Math.random() * 10) % 6;
    setRandom(number);
    // eslint-disable-next-line
  }, []);

  console.log("rendering");

  return (
    <div className={`w-[64.15rem] h-[91vh] grid place-items-center py-40 ${theme.text700} ${theme.bg100}`}>
      <img src={wumpus[random]} alt="" className='w-1/4' />
      <p>No one's around to play with Wumpus.</p>
    </div>
  )
}
