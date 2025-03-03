import React, { useContext } from 'react';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import moment from 'moment';
import avatar from '../../assets/avatar.svg';
import { unreadNotificationsFuntions } from '../../utils/unreadNotifications';
import { ChatContext } from '../../Context/ChatContext';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);

    const unreadNotifications = unreadNotificationsFuntions(notifications);
    const thisUserNotification = unreadNotifications?.filter(
        (n) => n.senderId === recipientUser?._id
    ) || [];

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);

    const { latestMessage } = useFetchLatestMessage(chat);

    const truncateText = (text = '') => {
        let short = text.substring(0, 20);
        if (text.length > 20) {
            short += '...';
        }
        return short;
    };

    return (
        <div>
            <Stack 
                direction="horizontal" 
                gap={3} 
                className="user-card align-items-center p-2 justify-content-between" 
                role="button" 
                onClick={() => {
                    if (thisUserNotification.length > 0) {
                        markThisUserNotificationsAsRead(thisUserNotification, notifications);
                    }
                }}
            >
                <div className="d-flex">
                    <div className="me-2">
                        <img 
                            src={avatar} 
                            height="45px" 
                            className="border border-3 border-primary rounded-circle shadow-lg" 
                            alt="user-avatar" 
                        />
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.name}</div>
                        <div className="text">
                            {latestMessage?.text && <span>{truncateText(latestMessage.text)}</span>}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">
                        {latestMessage?.createdAt ? moment(latestMessage.createdAt).calendar() : ''}
                    </div>
                    <div className={thisUserNotification.length > 0 ? 'this-user-notifications' : ''}>
                        {thisUserNotification.length > 0 ? thisUserNotification.length : ''}
                    </div>
                    <span className={isOnline ? 'user-online' : ''}></span>
                </div>
            </Stack>
        </div>
    );
};

export default UserChat;
