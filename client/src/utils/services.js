export const baseUrl = import.meta.env.URL

export const postRequest = async (url,body)=>{
        const respoce = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body
        })
        const data = await respoce.json()

        if(!respoce.ok){
            let message 
            if(data?.message){
                message = data.message
            }else{
                message=data
            }
            return {error : true,message}
        }

        return data;
}

export const getRequest = async (url)=>{
    const respoce = await fetch(url)

    const data = await respoce.json()

    if(!respoce.ok){
        let message = "An error occured "
        if(data?.message){
            message = data.message
        }

        return {error: true, message}
    }
   
    
    return data

}

