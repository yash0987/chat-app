import React from 'react';
import ChatList from '../../components/ChatList';

export default function FriendsSection() {
  return (
    <section>
      <ChatList chatListRequestURI={'http://localhost:5000/friends/list'} isGroup={false} />
    </section>
  )
}
