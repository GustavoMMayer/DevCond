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

let timer;



const Units = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modalNameField, setModalNameField] = useState('')
    const [modalOwnerSearchField, setModalOwnerSearchField] = useState('');
    const [modalOwnerList, setModalOwnerList] = useState('');
    const [modalOwnerField, setModalOwnerField] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] =useState(false);
    const [modalId, setModalId] = useState('')

    const [modalUnitList , setModalUnitList] = useState([]);
    const [modalAreaList , setModalAreaList] = useState([]);
    const [modalAreaId, setModalAreaId] = useState(0);
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalDateField, setModalDateField] = useState('');
    ;
    

    const fields =[
        {label:'Unidade', key: 'name', sorter: false},  
        {label:'Proprietário', key: 'name_owner', sorter: false},      
        {label: 'Ações', key:'actions', _style:{width:'1px'}, sorter: false, filter: false}
        
    ]

    useEffect(()=>{
        getList();
    },[]);

    useEffect(()=>{
        if(modalOwnerSearchField !== ""){

            clearTimeout(timer);
            timer = setTimeout(searchUser, 1500);
        }
    },[modalOwnerSearchField]);

    const searchUser = async ()=>{
        if(modalOwnerSearchField !==''){
            const result = await api.searchUser(modalOwnerSearchField);
            if(result.error === '' || result.error === null){
                setModalOwnerList(result.list)
            }else{
                alert(result.error)
            }
        }
    };
   

    const getList = async()=>{
        setLoading(true);
        const result = await api.getUnits();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
   

    const handleAddButton =()=>{
        setModalId('');
        setModalOwnerField(null)
        setModalNameField('')
        setModalOwnerList([]);
        setModalOwnerSearchField('')
        
        setShowModal(true);
    }

    const handleCloseModal =() => {
        setShowModal(false)
    }
  

    const handleModalSave = async ()=>{
        
        if(modalNameField){
            setModalLoading(true);
            let result;
            let data ={
                name: modalNameField,
                id_owner: modalOwnerField.id
                };

            if(modalId ===''){
                result = await api.addUnit(data)
            }else{
                result = await api.updateUnit(modalId,data);
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
        setModalNameField(list[index]['name']);
        setModalOwnerList([])
        setModalOwnerSearchField('')
        if(list[index]['name_owner']){
            setModalOwnerField({
                name: list[index]['name_owner'],
                id: list[index]['id_owner']
            });
        }else{
            setModalOwnerField(null);
        }
        setShowModal(true);
        
    }

    const handleDelButton = async (id) =>{
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeUnit(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }
    const selectModalOwnerField =(id)=>{
        let item = modalOwnerList.find(item =>item.id == id);
        setModalOwnerField(item);
        setModalOwnerList([]);
        setModalOwnerSearchField('');
    }

        

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Unidades</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton 
                                onClick={handleAddButton} 
                                color="primary"
                                                                >
                                <CIcon name="cil-check"/> Nova Unidade
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
                                    'name_owner':(item)=>(
                                        <td>
                                            {item.name_owner ?? ';-)'}
                                        </td>
                                    ),
                                    'actions':(item, index)=>(
                                        <td>
                                        <CButtonGroup> 
                                            <CButton color="success" onClick={null}> Detalhes</CButton> 
                                            <CButton color="info" onClick={()=>handleEditButton(item.id)} > Editar</CButton>
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
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Nova'} Unidade </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CLabel htmlFor="modal-name">Nome da Undidade</CLabel>
                    <CInput
                        type="text"
                        id="modal-name"
                        value={modalNameField}
                        onChange={e=>setModalNameField(e.target.value)}
                    />
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-owner">Proprietário(Nome, CPF ou E-mail)</CLabel>
                    {modalOwnerField === null &&

                    <>
                     <CInput
                        type="text"
                        id="modal-owner"
                        value={modalOwnerSearchField}
                        onChange={e=>setModalOwnerSearchField(e.target.value)}
                    />
                    {modalOwnerList.length > 0 &&
                        <CSelect
                            sizeHtml={5}
                            onChange={e=>selectModalOwnerField(e.target.value)}
                            >
                                {modalOwnerList.map((item, index)=>(
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}

                        </CSelect>
                    }
                    
                    </>
                    }
                    
                    { modalOwnerField !== null &&
                    <>
                        <br/>
                        <CButton
                             size="sm" 
                             color="danger"
                             onClick={()=>setModalOwnerField(null)}>
                                X
                        </CButton>
                        {` ${modalOwnerField.name}`}
                    </>}
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
export default Units;