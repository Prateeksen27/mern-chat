import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/chatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            if (!chat?._id) return; // Prevent API call if chat is null/undefined

            const response = await getRequest(`${baseUrl}/messages/${chat._id}`);

            if (response.error) {
                console.error("Error Getting Messages:", response);
                return;
            }

            if (response.length > 0) {
                setLatestMessage(response[response.length - 1]);
            }
        };

        getMessages();
    }, [chat?._id, newMessage, notifications]); // Add chat._id as a dependency

    return { latestMessage };
};
