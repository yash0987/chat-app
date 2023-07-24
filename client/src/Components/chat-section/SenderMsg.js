import React, { useState } from 'react'

export default function SenderMsg(props) {
  const [selectMessage, setSelectMessage] = useState(0);

  function selectAndUnselectMessage() {
    if (selectMessage && props.deleteToggle) {
      props.selectedMessageArray.push(props.element.messageID);
      return 'bg-violet-500 bg-opacity-20';
    }
    else if (selectMessage && !props.deleteToggle) {
      setSelectMessage(0);
    }
    
    const index = props.selectedMessageArray.indexOf(props.element.messageID);
    if (index > -1) props.selectedMessageArray.splice(index, 1);
    return 'bg-none';
  }
  
  return (
    <section onClick={() => props.deleteToggle ? setSelectMessage(selectMessage ^ 1) : null } className = {`message ${selectAndUnselectMessage()} select-none rounded-md flex justify-end my-1 p-1`} data-person='sender'>
      <p className = 'whitespace-pre-line px-2 py-1 max-w-2/3 rounded-md bg-gray-200 text-gray-600'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px]'> { props.element.currentMsgTime } </span>
      </p>
      { props.deleteToggle ? <div className='m-2'>&#9552;</div> : null }
    </section>
  )
}
