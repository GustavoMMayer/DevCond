import React, {useState, useEffect}from 'react'
import {TheContent,TheSidebar,TheFooter} from './index'
import useApei from '../Services/api'
import {useHistory} from 'react-router-dom'

const TheLayout = () => {
  const api = useApei();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const checkLogin = async () =>{     
    if(api.getToken()){      
      const result = await api.validadeToken;      
      if(result.error ==='' || result.error === undefined){
        setLoading(false);
      }else{
        alert(result.error);
        history.push('/login')
      }
    }else{
      history.push('/login');
    }
  };

  useEffect(()=>{    
    checkLogin();
  },[])

  return (
    <div className="c-app c-default-layout">
      {!loading &&
        <>  <TheSidebar/>
            <div className="c-wrapper">
                <div className="c-body">
                  <TheContent/>
                </div>
                <TheFooter/>
            </div>
        </>  
      }
    </div>
  )
}

export default TheLayout
