import React, { useContext } from 'react';
import { ChatContext } from '../Context/chatContext';
import {AuthContext} from '../Context/AuthContext'
import {Container, Stack} from 'react-bootstrap'
import UserChat from '../Components/chats/UserChat';
import PotentialChats from '../Components/chats/PotentialChats';
import ChatBox from '../Components/chats/ChatBox';
const Chat = () => {  
  const {
    userChats,
    userChatsError,
    isUserChatLoading,
    updateCurrentChat
  } = useContext(ChatContext);
  const {user} = useContext(AuthContext)
  return (
    <Container>
      <PotentialChats />
      {userChats?.length<1? null : 
      <Stack direction='horizontal' gap={4} className='align-items-start'>
        <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
        {isUserChatLoading && <p>Loading Chats...</p>}
        {userChats?.map((chat,index)=>{

return(
  <div key={index} onClick={()=>updateCurrentChat(chat)}>
    <UserChat chat={chat} user={user}/>
  </div>
)
        })}
        </Stack>
        <ChatBox />
        </Stack>}
    </Container>
  );
};

export default Chat;
