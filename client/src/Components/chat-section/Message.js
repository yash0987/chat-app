import React from 'react';

export default function Message(props) {
  return (
    <div>
      {
        props.elementArray.map((element) => {
          if (element.sender === props.googleID) {
            return (
              <label key={props.keyValue} className = 'message flex justify-end my-1'>
                <p className = 'whitespace-pre-line px-2 py-1 max-w-2/3 rounded-md bg-gray-200 text-gray-600'>
                  { element.collectedText }
                  <span className = 'flex justify-end text-[10px]'> { element.currentMsgTime } </span>
                </p>
                { props.deleteToggle ? <input type="checkbox" name="" id="" className='ml-3' /> : null }
              </label>
            );
          }
          
          return (
            <label className = 'message flex justify-start my-1'>
              { props.deleteToggle ? <input type="checkbox" name="" id="" className='ml-3' /> : null }
              <p className = 'whitespace-pre-line px-2 py-1 rounded-md text-white bg-violet-500'>
                { element.collectedText }
                <span className = 'flex justify-end text-[10px] text-white'> { element.currentMsgTime } </span>
              </p>
            </label>
          );
        })
      }
    </div>
  )
}
