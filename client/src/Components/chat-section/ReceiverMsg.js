import React, { useState } from 'react'

export default function ReceiverMsg(props) {
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
    <section onClick={() => props.deleteToggle ? setSelectMessage(selectMessage ^ 1) : null } className = {`message ${selectAndUnselectMessage()} select-none rounded-md flex justify-start my-1 p-1`} data-person='receiver'>
      { props.element.deleteToggle ? <div className='m-2'>&#9552;</div> : null }
      <p className = 'whitespace-pre-line px-2 py-1 rounded-md text-white bg-violet-500'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px] text-white'> { props.element.currentMsgTime } </span>
      </p>
    </section>
  )
}
