import {useEffect} from "react";
import { useHistory } from "react-router-dom";
import useApi from '../Services/api';

 const Logout = ()=>{
    const api = useApi();
    const history = useHistory();

    
    useEffect(()=>{
        const doLogout = async ()=>{
            await api.logout();
            history.push('/login')
        };
        
        doLogout();
    },[])
    return null
};
export default Logout;