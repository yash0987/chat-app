import React, { useState, useEffect } from 'react'

export default function SenderMsg(props) {
  const [selectMessage, setSelectMessage] = useState(0);

  function selectAndUnselectMessage() {
    setSelectMessage(selectMessage ^ 1)
    if (!selectMessage) {
      console.log("select message")
      props.setSelectedMessageArray([...props.selectedMessageArray, props.element.messageID]);
      if (!props.element.star) props.setStar(props.star + 1);
    }
    else if (selectMessage) {
      console.log("unselect message")
      props.setSelectedMessageArray(() => props.selectedMessageArray.filter((element) => element !== props.element.messageID));
      if (!props.element.star) props.setStar(props.star - 1);
    }
  }

  useEffect(() => {
    if (selectMessage && !props.deleteToggle) setSelectMessage(0);
    // eslint-disable-next-line
  }, [props.deleteToggle]);
  
  return (
    <section onClick={ () => props.deleteToggle ? selectAndUnselectMessage() : null } className = {`message ${ selectMessage && props.deleteToggle ? 'bg-violet-500 bg-opacity-20' : 'bg-none' } select-none rounded-md flex justify-end my-1 p-1`} data-person='sender'>
      <p className = 'whitespace-pre-wrap break-words px-2 py-1 max-w-xs rounded-md bg-gray-200 text-gray-600'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px]'> { props.element.star ? <span>&#9733;  </span> : null } { props.element.currentMsgTime } </span>
      </p>
      { props.deleteToggle ? <div className='m-2'>&#9552;</div> : null }
    </section>
  )
}
