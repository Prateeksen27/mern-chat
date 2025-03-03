import React, { useContext, useState } from 'react';
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';
import { unreadNotificationsFuntions } from '../utils/unreadNotifications';
import moment from 'moment';
import { FloatingLabel } from 'react-bootstrap';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, allUsers, markAllAsRead, markNotificationAsRead,userChats } = useContext(ChatContext); // Ensure notification is always an array
    const { user } = useContext(AuthContext);

    const unreadNotifications = unreadNotificationsFuntions(notifications || []); // Pass empty array if undefined

    const modifiedNotifications = notifications.map((n) => {
        const sender = allUsers.find(user => user._id === n.senderId);
        return {
            ...n,
            senderName: sender?.name || "Unknown"
        };
    });
    console.log("Unread", modifiedNotifications);

    return (
        <div className='notifications'>
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
                {unreadNotifications.length > 0 ? (
                    <span className="notification-count">{unreadNotifications.length}</span>
                ) : <span className='notification-count'>0</span>}
            </div>

            {isOpen && (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <button className='mark-as-read' onClick={() => {
                            markAllAsRead(notifications)
                        }}>
                            Mark all as read
                        </button>
                    </div>

                    {modifiedNotifications.length === 0 ? (
                        <p className="no-notifications">No new notifications</p>
                    ) : (
                        modifiedNotifications.map((n, index) => (
                            <div key={index} className={n.isRead ? "notification" : "notification not-read"} onClick={()=>{
                                markNotificationAsRead(n,userChats,user,notifications)
                                setIsOpen(false)
                            }}>
                                <span>{`${n.senderName} sent you a new message`}</span>
                                <span className='notification-time'>{moment(n.date).calendar()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
