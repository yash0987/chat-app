import React from 'react';
import ChatList from 'components/ChatList';

export default function GroupsSection() {
  return (
    <section>
      <ChatList chatListRequestURI={'http://localhost:5000/groups/list'} isGroup={true} />
    </section>
  )
}
