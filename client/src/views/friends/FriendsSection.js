import React from 'react';
import { useSelector } from 'react-redux';
import ChatList from 'components/ChatList';

export default function FriendsSection() {
  const friends = useSelector(state => state.auth.value.user.friends);

  return (
    <ChatList chats={friends} isGroup={false} />
  )
}
