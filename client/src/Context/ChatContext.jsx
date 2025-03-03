import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [userChatsError, setUserChatsError] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications,setNotifications]=useState([])
    const [allUsers,setAllUsers]=useState([])
    
    // Initialize socket connection
    useEffect(() => {
        if (!user?._id) return; // Prevents socket connection without a valid user
        
        const newSocket = io(import.meta.env.VITE_SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit("addNewUser", user._id); // Send userId to server
        
        newSocket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Send new message to socket
    useEffect(() => {
        if (!socket || !newMessage || !currentChat) return;

        const recipientId = currentChat.members.find((id) => id !== user?._id);

        socket.emit("sendMessage", {
            ...newMessage,
            recipientId,
        });
    }, [newMessage, socket, currentChat, user]);

    // Receive messages via socket and notification
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
        };

        socket.on("getMessage", handleMessage);
        socket.on("getNotification",(res)=>{
            const isChatOpen = currentChat?.members.some(id=> id===res.senderId)
            if(isChatOpen){
                setNotifications(prev=>[{...res,isRead:true},...prev])
            }else{
                setNotifications(prev=>[res,...prev])
            }
        })
        return () => {
            socket.off("getMessage", handleMessage);
            socket.off("getNotifications")
        };
    }, [socket, currentChat]);

    // Fetch users and determine potential chats
    useEffect(() => {
        const getUsers = async () => {
            const url = `${baseUrl}/users`;
            const response = await getRequest(url);
            if (response.error) {
                console.log("Error fetching users:", response);
                return;
            }

            const pChats = response.filter((u) => {
                if (user?._id === u._id) return false;
                const isChatCreated = userChats?.some((chat) =>
                    chat.members.includes(u._id)
                );
                return !isChatCreated;
            });

            setPotentialChats(pChats);
            setAllUsers(response)
        };

        getUsers();
    }, [userChats, user]);

    // Fetch user chats
    useEffect(() => {
        if (!user?._id) return;

        const getUserChats = async () => {
            setIsUserChatLoading(true);
            setUserChatsError(null);

            const url = `${baseUrl}/chat/${user._id}`;
            const response = await getRequest(url);

            setIsUserChatLoading(false);
            if (response.error) {
                setUserChatsError(response);
                return;
            }

            setUserChats(response);
        };

        getUserChats();
    }, [user?._id,notifications]);

    // Fetch messages for current chat
    useEffect(() => {
        if (!currentChat?._id) return;

        const getMessages = async () => {
            setIsMessageLoading(true);
            setMessageError(null);

            const url = `${baseUrl}/messages/${currentChat._id}`;
            const response = await getRequest(url);

            setIsMessageLoading(false);
            if (response.error) {
                setMessageError(response);
                return;
            }

            setMessages(response);
        };

        getMessages();
    }, [currentChat]);

    // Send a text message
    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId) => {
            if (!textMessage.trim()) {
                console.log("Write something...");
                return;
            }

            try {
                const response = await postRequest(
                    `${baseUrl}/messages`,
                    JSON.stringify({
                        chatId: currentChatId,
                        senderId: sender?._id,
                        text: textMessage,
                    })
                );

                if (response.error) {
                    setSendTextMessageError(response);
                    return;
                }

                setNewMessage(response);
                setMessages((prev) => [...prev, response]);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        },
        []
    );

    // Update current chat
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    // Create a new chat
    const createChat = useCallback(async (firstId, secondId) => {
        const url = `${baseUrl}/chat`;
        const response = await postRequest(
            url,
            JSON.stringify({ firstId, secondId })
        );

        if (response.error) {
            console.log("Error creating chat:", response);
            return;
        }

        setUserChats((prev) => [...(prev || []), response]);
    }, []);

    const markAllAsRead = useCallback((n) => {
        const m =  n.map((notification) => (  {
            ...notification,
            isRead: true
        }));
        setNotifications(m)
    }, []);


    const markNotificationAsRead = useCallback((n,userChats,user,notification)=>{
        // find chat to open
        const desiredchat = userChats.find(chat=>{
            const chatMembers = [user._id,n.senderId]
            const isDesiredchat = chat?.members.every(member=>{
                return chatMembers.includes(member)
            })

            return isDesiredchat
        })

        // mark now notification as read 
        const mNoti = notification.map(el=>{
            if(n.senderId===el.secondId){
                return {
                    ...n,isRead:true
                }
            }
            else{
                return el
            }
        })

        updateCurrentChat(desiredchat)
        setNotifications(mNoti)
    },[])
    
    // const markThisUserNotificationsAsRead = useCallback((thisUserNotification, notifications)=>{
    //     const mNoti = notifications.map(el=>{
    //         let notification ;
    //         thisUserNotification.forEach(n=>{
    //             if(n.senderId === el.senderId){
    //                 notification = {...mNoti,isRead:true}
    //             }else{
    //                 notification = el
    //             }
    //         })

    //         return notification
    //     })

    //     setNotifications(mNoti)
    // })
    const markThisUserNotificationsAsRead = useCallback((thisUserNotification, notifications) => {
        const updatedNotifications = notifications.map(el => {
            const isMatched = thisUserNotification.some(n => n.senderId === el.senderId);
            return isMatched ? { ...el, isRead: true } : el;
        });
    
        setNotifications(updatedNotifications);
    }, []);
    

    return (
        <ChatContext.Provider
            value={{
                userChats,
                userChatsError,
                isUserChatLoading,
                potentialChats,
                createChat,
                updateCurrentChat,
                messages,
                isMessageLoading,
                messageError,
                currentChat,
                sendTextMessage,
                onlineUsers,
                notifications,
                allUsers,
                markAllAsRead,
                markNotificationAsRead,
                markThisUserNotificationsAsRead
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
