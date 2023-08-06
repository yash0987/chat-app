import React from 'react';

export default function DeleteMessage(props) {
  function deleteForMe() {
    props.deleteMessages();
    props.setDeleteToggle(false);
    props.setShowDeleteModal(false);
  }
  
  return (
    <section className={`flex justify-center py-80 w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-20 ${props.showDeleteModal ? '' : ''}`}>
      <div className='p-5 w-1/5 rounded-sm bg-violet-50'>
        <p>{ props.selectedMessageArray.length < 2 ? `Delete message?` : `Delete ${props.selectedMessageArray.length} messages?` }</p>
        <div className='text-violet-600'>
          <button onClick={ () => deleteForMe() } className='flex justify-end'>Delete for me</button>
          <button onClick={ () => props.setShowDeleteModal(false) }>Cancel</button>
        </div>
      </div>
    </section>
  )
}
