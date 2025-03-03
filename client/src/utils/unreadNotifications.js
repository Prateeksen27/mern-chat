export const unreadNotificationsFuntions = (notifications = []) => {
    if (!Array.isArray(notifications)) return [];
    return notifications.filter(n => n.isRead===false);
};
