import React, {useState} from 'react';

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import useApi from '../Services/api'
import {useHistory} from 'react-router-dom'

const Login = () => {

  const api = useApi();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginButton = async ()=>{
   
    if(email !=='' && password !==''){
      setLoading(true);
      const result = await api.login(email,password);
      setLoading(false);
      
      console.log(result.error)

      if(result.error ===""){
        
        localStorage.setItem('token', result.token)
        history.push('/');
      }else{
        setError(result.error);
      }

    }else{
      if(email ==='' && password ===''){
        setError('Informe email e senha');
      } else if(email ===""){
        setError('Informe email');
      } else{
        setError('Informe senha')
      }
    }

  }


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Digite seus dados de acesso</p>

                    {error !=='' &&
                    <CAlert color='danger'>{error}</CAlert>
                    }

                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput 
                          onChange={e=>setEmail(e.target.value)} 
                          type="text" 
                          placeholder="Email" 
                          value={email} 
                          disabled={loading}/>
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput 
                          type="password" 
                          placeholder="Senha" 
                          value={password} 
                          onChange={e=>setPassword(e.target.value)}
                          disabled={loading} />
                    </CInputGroup>

                    <CRow>
                      <CCol xs="6">
                        <CButton 
                            onClick={handleLoginButton} 
                            color="primary" 
                            disabled ={loading}
                            className="px-4">
                            {loading? "Carregando": 'Entrar'}
                        </CButton>
                      </CCol>
                    </CRow>

                  </CForm>
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
