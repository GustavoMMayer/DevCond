import React, {useState, useEffect} from "react";
import { 
    CButton, 
    CButtonGroup, 
    CCard, 
    CCardBody, 
    CCardHeader, 
    CCol, 
    CDataTable, 
    CFormGroup, 
    CInput, 
    CLabel, 
    CModal, 
    CModalBody, 
    CModalFooter, 
    CModalHeader, 
    CRow, 
    CSelect, 
    
}from '@coreui/react';
import CIcon from "@coreui/icons-react";

import useApi from '../Services/api'



const Users = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modalName , setModalName] = useState('');
    const [modalEmail , setModalEmail] = useState('');
    const [modalCpf, setModalCpf] = useState('');
    const [modalPass1, setModalPass1] = useState('');
    const [modalPass2, setModalPass2] = useState('');
    
    
    
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] =useState(false);
    const [modalId, setModalId] = useState('');
    

    const fields =[
        {label:'Nome', key: 'name'}, 
        {label:'CPF', key: 'cpf'}, 
        {label:'E-mail', key: 'email'},                  
        {label: 'Ações', key:'actions', _style:{width:'1px'}, sorter: false, filter: false}
        
    ]

    useEffect(()=>{
        getList();
      
    },[]);

   

    const getList = async()=>{
        setLoading(true);
        const result = await api.getUsers();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
   
    const handleAddButton =()=>{
        setModalId('');
        setModalName('');
        setModalEmail('');
        setModalCpf('');
        setModalPass1('');
        setModalPass2('');
        setShowModal(true);
    }

    const handleCloseModal =() => {
        setShowModal(false)
    }
  

    const handleModalSave = async ()=>{
        
        if(modalName && modalCpf && modalEmail){
            setModalLoading(true);
            let result;
            let data ={
                id: modalId,
                name: modalName,
                email: modalEmail,
                cpf: modalCpf
                
                };
            if(modalPass1){
                if(modalPass1 === modalPass2){
                    data.password = modalPass1;

                }else{
                    alert('A senha não foi digitada corretamente, tente novamente')
                    setLoading(false)
                }
            }

            if(modalId ===''){
                result = await api.addUser(data)
            }else{
                result = await api.updateUser(modalId,data);
            }
             
            setModalLoading(false)
            if(result.error ==='' || result.error === undefined){
                setShowModal(false);
                getList();
            }else{
                alert(result.error)
            }

        }else{
            alert('Preencha os campos para continuar')
        }

    };


    const handleEditButton = (id) =>{
        let index = list.findIndex(v=>v.id === id)
        setModalId(list[index]['id']);
        setModalName(list[index]['name'])
        setModalEmail(list[index]['email'])
        setModalCpf(list[index]['cpf']);
        setModalPass1('');
        setModalPass2('');
        setShowModal(true);
        
    }

    const handleDelButton = async (id) =>{
        
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeUser(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }

    
    

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Usuários</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton 
                                onClick={handleAddButton} 
                                color="primary"
                                
                                >
                                <CIcon name="cil-check"/> Novo usuário
                            </CButton>
                        </CCardHeader>

                        <CCardBody>
                            <CDataTable
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot= ''
                                columnFilter
                                sorter
                                hover
                                striped
                                border
                                pagination
                                itemsPerPage={10}
                                scopedSlots={{
                                    'actions':(item, index)=>(
                                        <td>
                                        <CButtonGroup>                                            
                                            <CButton 
                                                color="info" 
                                                onClick={()=>handleEditButton(item.id)} 
                                                >
                                                    Editar
                                            </CButton>
                                            <CButton color="danger" onClick={()=>handleDelButton(item.id)}>Excluir</CButton>
                                          
                                        </CButtonGroup>
                                        </td>    
                                    )
                                }}

                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        <CModal show={showModal} onClose={handleCloseModal}>
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Novo'} Usuário </CModalHeader>
            <CModalBody>
            
                <CFormGroup>
                    <CLabel htmlFor="modal-name">Nome do usuário</CLabel>
                    <CInput
                        type="text"
                        id="modal_name"
                        value={modalName}
                        onChange={e=>setModalName(e.target.value)}
                        disabled={modalLoading}
                    />                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-email">E-mail</CLabel>
                    <CInput
                        type="email"
                        id="modal_email"
                        value={modalEmail}
                        onChange={e=>setModalEmail(e.target.value)}
                        disabled={modalLoading}
                    />                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-cpf">CPF</CLabel>
                    <CInput
                        type="number"
                        id="modal_cpf"
                        value={modalCpf}
                        onChange={e=>setModalCpf(e.target.value)}
                        disabled={modalLoading}
                        /> 
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-pass">Nova Senha</CLabel>
                    <CInput
                        type="password"
                        id="modal_pass"
                        placeholder='Digite a nova senha de usuário'
                        value={modalPass1}
                        onChange={e=>setModalPass1(e.target.value)}
                        disabled={modalLoading}
                    />                       
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-pass2">Confirmação senha</CLabel>
                    <CInput
                        type="password"
                        id="modal_pass2"
                        value={modalPass2}
                        placeholder='Digite novamente a nova senha de usuário'
                        onChange={e=>setModalPass2(e.target.value)}
                        disabled={modalLoading}
                    />                       
                </CFormGroup>                
           

                
            </CModalBody>
            <CModalFooter>
                <CButton disabled={modalLoading} onClick={handleModalSave} color="primary">{modalLoading? 'Carregando': 'Salvar'}</CButton>
                <CButton disabled={modalLoading} onClick={handleCloseModal} color="secondary">Cancelar</CButton>
                

               
            </CModalFooter>
        </CModal>
        </>
    )


};
export default Users;