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
    
}from '@coreui/react';
import CIcon from "@coreui/icons-react";

import useApi from '../Services/api'


 const Documents = () =>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] =useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalFileField , setModalFileField] = useState([])
    const [modalId, setModalId] = useState('');
    

    const fields =[
        {label:'Titulo', key: 'title'},        
        {label: 'Ações', key:'actions', _style:{width:'1px'}}
        
    ]

    useEffect(()=>{
        getList();
    },[]);

    const handleAddButton =()=>{
        setModalId('');
        setModalTitleField('');
        setModalFileField('');
        setShowModal(true);
    }

    const handleCloseModal =() => {
        setShowModal(false)
    }
  

    const handleModalSave = async ()=>{
        if(modalTitleField !==''){
            setModalLoading(true);
            let result;
            let data ={
                title: modalTitleField
                
                };

            if(modalId ===''){
                if(modalFileField !==''|| modalFileField !== undefined){
                    data.file= modalFileField;
                    result = await api.addDocument(data)
                }else{
                    alert('Selecione um arquivo');
                    setLoading(false);
                    return;
                }
            }else{
                if(modalFileField){
                data.file = modalFileField;
                }

                result = await api.updateDocument(modalId,data);
                
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

    const handleDownloadutton = (id) => {
        let index = list.findIndex(v=>v.id === id)
        window.open(list[index]['fileurl']);
        

    };

    const handleEditButton = (id) =>{
        let index = list.findIndex(v=>v.id === id)
        setModalId(list[index]['id']);
        setModalTitleField(list[index]['title']);
        setModalFileField(list[index]['body']);
        setShowModal(true);
    }

    const handleDelButton = async (id) =>{
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeDocument(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }

    const getList = async()=>{
        setLoading(true);
        const result = await api.getDocuments();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
    return(
        <>
            <CRow>
                <CCol>
                    <h2>Documentos</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleAddButton} color="primary">
                                <CIcon name="cil-check"/> Novo Documento
                            </CButton>
                        </CCardHeader>

                        <CCardBody>
                            <CDataTable
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot= ''
                                hover
                                striped
                                border
                                pagination
                                itemsPerPage={10}
                                scopedSlots={{
                                    'actions':(item, index)=>(
                                        <td>
                                        <CButtonGroup>
                                            
                                            <CButton color="success" onClick={()=>handleDownloadutton(item.id)}>
                                                <CIcon name="cil-cloud-download"/>
                                            </CButton>
                                            <CButton color="info" onClick={()=>handleEditButton(item.id)}>Editar</CButton>
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
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Novo'} Documento </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel htmlFor="modal-title">Titulo do documento</CLabel>
                    <CInput
                        type="text"
                        id="modaltitle"
                        placeholder="digite novo titulo para o documento"
                        value={modalTitleField}
                        onChange={e=>setModalTitleField(e.target.value)}
                        disabled={modalLoading}
                    />
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-file">Arquivo (pdf)</CLabel>
                    <CInput 
                        type="file"
                        id='modal-file'
                        name="file"
                        placeholder="Escolha o documento"
                        onChange={(e)=>setModalFileField(e.target.files[0])}
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


}
export default Documents;