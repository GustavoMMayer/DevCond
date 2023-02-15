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
    CTextarea
}from '@coreui/react';
import CIcon from "@coreui/icons-react";

import useApi from '../Services/api'


const Wall = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] =useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalBodyField, setModalBodyField]= useState('');
    const [modalId, setModalId] = useState('');

    const fields =[
        {label:'Titulo', key: 'title'},
        {label:'Data de criação', key:'datecreated', _style:{width:'200px'}},
        {label: 'Ações', key:'actions', _style:{width:'1px'}}
        
    ]

    useEffect(()=>{
        getList();
    },[]);

    const handleAddButton =()=>{
        setModalId('');
        setModalTitleField('');
        setModalBodyField('');
        setShowModal(true);
    }

    const handleCloseModal =() => {
        setShowModal(false)
    }

    const handleEditButton = (id) =>{
        let index = list.findIndex(v=>v.id === id)
        setModalId(list[index]['id']);
        setModalTitleField(list[index]['title']);
        setModalBodyField(list[index]['body']);
        setShowModal(true);
    }
    const handleModalSave = async ()=>{
        if(modalBodyField!=='' & modalTitleField !==''){
            setModalLoading(true);
            let result;
            let data ={
                title: modalTitleField,
                body: modalTitleField
                };

            if(modalId ===''){
                result = await api.addWall(data)
            }else{
                result = await api.updateWall(modalId,data);

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

    }

    const handleDelButton = async (id) =>{
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeWall(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }

    const getList = async()=>{
        setLoading(true);
        const result = await api.getWall();
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
                <h2>Mural de avisos</h2>

                <CCard>
                    <CCardHeader>
                        <CButton onClick={handleAddButton} color="primary">
                            <CIcon name="cil-check"/> Novo Aviso
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
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Novo'} aviso </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel htmlFor="modal-title">Titulo do aviso</CLabel>
                    <CInput
                        type="text"
                        id="modaltitle"
                        placeholder="digite novo titulo para o aviso"
                        value={modalTitleField}
                        onChange={e=>setModalTitleField(e.target.value)}
                        disabled={modalLoading}
                    />
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-body">Conteúdo do aviso</CLabel>
                    <CTextarea
                        id="modalbody"
                        placeholder="digite o contúdo do aviso"
                        value={modalBodyField}
                        onChange={e=>setModalBodyField(e.target.value)}
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


}

export default Wall;