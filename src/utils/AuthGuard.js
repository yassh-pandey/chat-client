import { Redirect } from 'react-router';
import {useAuthState} from "../context/auth";

function AuthGuard({children, restrictAuthenticated, fallback}) {
    const authState = useAuthState();

    return (
            restrictAuthenticated
            ?
                (
                    authState?.user
                    ?
                        <Redirect to={fallback} />  
                    :
                        <>
                            {
                                children
                            }
                        </>

                )
            :
                (
                    authState?.user 
                    ?
                        <>
                            {
                                children
                            }
                        </>
                    :
                        <Redirect to={fallback} />     
                )
        )
}

export default AuthGuard;
