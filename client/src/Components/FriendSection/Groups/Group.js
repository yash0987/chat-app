import React from 'react'

export default function Group(props) {
  function openChat() {
    
  }

  return (
    <section className='flex justify-between mx-1 px-6 py-2 rounded-lg font-semibold hover:bg-violet-100'>
        <div className='flex'>
            <img src={ props.GroupInfo.groupPhotoURL } alt="" className='w-10 rounded-full' />
            <div className='mx-4'>
              <p>{ props.GroupInfo.groupName }</p>
              <p className='text-[10px] text-gray-400'>{ props.GroupInfo.groupID }</p>
            </div>
        </div>
        <div>
            <button onClick={openChat} className='my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Message</button>
        </div>
    </section>
  )
}
