import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";

// Create AuthContext with a default value (null)
export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialized to null to prevent undefined issues
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setLoginLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    useEffect(()=>{
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user))
    },[])
    const updateRegister = useCallback((info) => {
        setRegisterInfo(info);
    }, []);
    const updateLogin = useCallback((info) => {
        setLoginInfo(info);
    }, []);
   

    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        try {
            const res = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo), {
                headers: { "Content-Type": "application/json" }
            });

            if (res?.error) {
                setRegisterError(res);
            } else {
                localStorage.setItem("User", JSON.stringify(res));
                setUser(res);
            }
        } catch (error) {
            setRegisterError({ error: "Something went wrong!" });
        } finally {
            setIsRegisterLoading(false);
        }
    }, [registerInfo]); // Fixed dependencies

    const loginUser =  useCallback( async(e)=>{
        e.preventDefault()
        setLoginLoading(true)
        setLoginError(null)
        const res = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo), {
            headers: { "Content-Type": "application/json" }
        });
        setLoginLoading(false)
        if(res.error){
            return setLoginError(res)
        }
        localStorage.setItem("User",JSON.stringify(res))
        setUser(res)
    },[loginInfo])

    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User")
        setUser(null)
    },[])

    return (
        <AuthContext.Provider value={{ 
            user, 
            registerInfo, 
            updateRegister,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginError,
            loginInfo,
            updateLogin,
            isLoginLoading,
            loginUser,
            
        }}>
            {children}
        </AuthContext.Provider>
    );
};
