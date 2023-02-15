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



const Reservation = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modalUnitList , setModalUnitList] = useState([]);
    const [modalAreaList , setModalAreaList] = useState([]);
    const [modalAreaId, setModalAreaId] = useState(0);
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalDateField, setModalDateField] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] =useState(false);
    const [modalId, setModalId] = useState('');
    

    const fields =[
        {label:'Unidade', key: 'name_unit', sorter: false},  
        {label:'Área', key: 'name_area', sorter: false}, 
        {label:'Data da reserva', key: 'reservation_date'},         
        {label: 'Ações', key:'actions', _style:{width:'1px'}, sorter: false, filter: false}
        
    ]

    useEffect(()=>{
        getList();
        getUnitList();
        getAreaList();
    },[]);

   

    const getList = async()=>{
        setLoading(true);
        const result = await api.getReservations();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
    const getUnitList = async()=>{
        const result = await api.getUnits();
        if(result.error ==='' | result.error === undefined){
            setModalUnitList(result.list)
        } 
    }
    const getAreaList = async()=>{
        const result = await api.getAreas();
        if(result.error ==='' | result.error === undefined){
            setModalAreaList(result.list)
        }
    }

    const handleAddButton =()=>{
        setModalId('');
        setModalUnitId(modalUnitList[0]['id'])
        setModalAreaId(modalAreaList[0]['id'])
        setModalDateField('');
        setShowModal(true);
    }

    const handleCloseModal =() => {
        setShowModal(false)
    }
  

    const handleModalSave = async ()=>{
        
        if(modalUnitId && modalAreaId && modalDateField){
            setModalLoading(true);
            let result;
            let data ={
                id_unit: modalUnitId,
                id_area: modalAreaId,
                reservation_date: modalDateField
                };

            if(modalId ===''){
                result = await api.AddReservation(data)
            }else{
                result = await api.updateReservation(modalId,data);
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
        setModalUnitId(list[index]['id_unit'])
        setModalAreaId(list[index]['id_area'])
        setModalDateField(list[index]['reservation_date']);
        setShowModal(true);
        
    }

    const handleDelButton = async (id) =>{
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeReservation(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }

    const formatDate = (option,date) =>{
        let [initialDate, initialTime] = modalDateField.split(' ')

       let [onlyDate, hour] = date.split(' ');
       let [year, month, day] = onlyDate.split('-');
       let dateFormated2 = `${year}-${month}-${day}`
      
        switch (option){
            case 'Date':
                return dateFormated2;
            case 'time':
                return hour;
            case 'onlyDate':
                    
                return `${date} ${initialTime}:00 `
            case 'onlyTime':
               
                return `${initialDate} ${date}:00`;
            default: alert('Erro inesperado')
        }
                             
    }
    

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Reservas</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton 
                                onClick={handleAddButton} 
                                color="primary"
                                disabled={modalUnitList.length === 0  || modalAreaList === 0}
                                >
                                <CIcon name="cil-check"/> Nova Reserva
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
                                    'reservation_date':(item)=>(
                                        <td>
                                            {item.reservation_date_formatted}
                                        </td>
                                    ),
                                    'actions':(item, index)=>(
                                        <td>
                                        <CButtonGroup>                                            
                                            <CButton 
                                                color="info" 
                                                onClick={()=>handleEditButton(item.id)} 
                                                disabled={modalUnitList.length === 0  || modalAreaList === 0}>
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
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Nova'} Reserva </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel htmlFor="modal_unit">Unidade</CLabel>
                    <CSelect
                        id='modal_unit'
                        custom
                        onChange={e=>setModalUnitId(e.target.value)}
                        value ={modalUnitId}
                        >
                            {modalUnitList.map((item, index)=>(
                                <option key={index}
                                        value ={item.id} >
                                            {item.name}
                                </option>
                            ))}

                    </CSelect>
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal_area">Área</CLabel>
                    <CSelect
                        id='modal_area'
                        custom
                        onChange={e=>setModalAreaId(e.target.value)}
                        value={modalAreaId}
                        >
                            {modalAreaList.map((item, index)=>(
                                <option 
                                    key={index} 
                                    value ={item.id}>
                                        {item.title}
                                </option>
                            ))}
                    </CSelect>
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-date">Data da reserva</CLabel>
                    <CInput
                        type="date"
                        id="modal_date"
                        value={formatDate('Date',modalDateField)}
                        onChange={e=>setModalDateField(formatDate('onlyDate', e.target.value))}
                        disabled={modalLoading}
                    />

                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-time">Hora da reserva</CLabel>
                    <CInput
                        type="time"
                        id="modal_time"
                        value={formatDate('time',modalDateField)}
                        onChange={e=>setModalDateField(formatDate('onlyTime', e.target.value))}
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
export default Reservation;