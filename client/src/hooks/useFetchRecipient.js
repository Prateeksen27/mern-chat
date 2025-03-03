import { useEffect,useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat,user)=>{
    const [recipientUser,setRecipientuser]=useState(null)
    const [error,setError] = useState(null)


    const recipientId = chat?.members.find((id)=> id!==user?._id)
    
    
    
    useEffect(()=>{
        const getUser = async ()=>{

            if(!recipientId) return null

            const responce = await getRequest(`${baseUrl}/users/find/${recipientId}`)

            if(responce.error){
                return setError(responce)
            }

            setRecipientuser(responce)

        }

        getUser()
    },[recipientId])

    return {recipientUser}
}