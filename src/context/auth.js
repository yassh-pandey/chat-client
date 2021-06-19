import * as React from "react";
import jwt_decode from "jwt-decode";

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

const initialAuthState = {
    user: null,
};

function lazyInitAuthState(initialAuthState){

    // Deep copying object
    let initialState = JSON.parse(JSON.stringify(initialAuthState));

    const accessToken = window.localStorage.getItem("accessToken");
    
    if(accessToken){
        const user = jwt_decode(accessToken);
        try{
            if(user){
                const expiresIn = new Date(user?.exp) * 1000;
                if(expiresIn < new Date()){
                    return initialState
                }
                else{
                    initialState.user = {
                        userName: user?.userName,
                        email: user?.email,
                    };
                    return initialState;
                }
            }
            else{
                return initialState;
            }
        }
        catch(err){
            console.log(err);
            return initialState;
        }
    }
    else{
        return initialState;
    }
}

const authReducer = (state, action)=>{
    switch(action.type){
        case "LOGIN":
            window.localStorage.setItem("accessToken", action?.payload?.token);
            return {
                ...state,
                user: {
                    ...(state?.user || {}),
                    userName: action?.payload?.userName,
                    email: action?.payload?.email,
                }
            }
        case "LOGOUT": 
            window.localStorage.removeItem("accessToken");
            return {
                ...state,
                user: null,
            }
        default: 
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const AuthProvider = ({children})=>{
    const [state, dispatch] = React.useReducer(authReducer, initialAuthState, lazyInitAuthState);
    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    )
}

const useAuthState = ()=>{
    const context = React.useContext(AuthStateContext);
    console.log(context);
    if(context===undefined){
        throw new Error("useAuthState must be used within an AuthProvider.");
    } 
    return context;
}

const useAuthDispatch = ()=>{
    const context = React.useContext(AuthDispatchContext);
    if(context===undefined){
        throw new Error("useAuthDispatch must be used within an AuthProvider.");
    } 
    return context;
}

export {
    AuthProvider, 
    useAuthState, 
    useAuthDispatch
};