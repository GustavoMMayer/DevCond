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
    CInputCheckbox, 
    CLabel, 
    CModal, 
    CModalBody, 
    CModalFooter, 
    CModalHeader, 
    CRow, 
    CSwitch, 
    
}from '@coreui/react';
import CIcon from "@coreui/icons-react";

import useApi from '../Services/api'



const CommonAreas = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modalLoading, setModalLoading] =useState(false);
    const [showModal, setShowModal] = useState(false);    
    const [modalId, setModalId] = useState('');
    const [modalAllowedField, setModalAllowedField ] = useState('1');
    const [modalTitleField, setModalTitleField ] = useState('');
    const [modalCoverField, setModalCoverField ] = useState('');
    const [modalDaysField, setModalDaysField ] = useState([]);
    const [modalStartTimeField, setModalStartTimeField ] = useState('');
    const [modalEndTimeField, setModalEndTimeField ] = useState('');

    const fields =[
        {label:'Ativo', key: 'allowed', sorter: false, filter: false},  
        {label:'Capa', key: 'cover', sorter: false, filter: false}, 
        {label:'Título', key: 'title'},      
        {label:'Dias de funcionamento', key: 'dates'},    
        {label:'Horário de inicio', key: 'start_time', filter: false}, 
        {label:'Horário de fim', key: 'end_time', filter: false}, 
        {label: 'Ações', key:'actions', _style:{width:'1px'}, sorter: false, filter: false}
    ]

    useEffect(()=>{
        getList();
       
    },[]);

   

    const getList = async()=>{
        setLoading(true);
        const result = await api.getAreas();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
    };
    
    const handleAddButton =()=>{
        setModalId('');
        setModalAllowedField(1);
        setModalTitleField('');
        setModalCoverField('');
        setModalDaysField('');
        setModalStartTimeField('');
        setModalEndTimeField('');
        setShowModal(true);
    };

    const handleCloseModal =() => {
        setShowModal(false)
    };
  

    const handleModalSave = async ()=>{
        
        if(modalTitleField && modalStartTimeField && modalEndTimeField){
            setModalLoading(true);
            let result;
            let data ={
                allowed: modalAllowedField,
                title: modalTitleField,
                days: modalDaysField.join(','),
                start_time: modalStartTimeField,
                end_time: modalEndTimeField
                };

            if(modalCoverField) {
                    data.cover = modalCoverField;
            };
            

            if(modalId ===''){
                result = await api.addArea(data)
            }else{
                result = await api.updateArea(modalId,data);
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
        setModalAllowedField(list[index]['allowed']);
        setModalCoverField('');
        setModalTitleField(list[index]['title']);
        setModalDaysField(list[index]['days'].split(','));
        setModalStartTimeField(list[index]['start_time']);
        setModalEndTimeField(list[index]['end_time']);
        setShowModal(true);
        
    }

    const handleDelButton = async (id) =>{
      if(window.confirm('Tem certeza que deseja excluir?')){
        const result = await api.removeArea(id);
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }
    }

    const handleSwitchClick =async(item)=>{
        setLoading(true)
        const result = await api.updateAreaAllowed(item.id);
        setLoading(false)
        if(result.error ==='' || result.erro === undefined){
            getList();
        }else{
            alert(result.error)
        }
      }

    

    const toggleModalDays = (item, event)=>{
        let days = [... modalDaysField]
        
        if(event.target.checked === false){
           days = days.filter(day => day !== item);
        } else{
            days.push(item);
        }
        console.log(days)
        setModalDaysField(days);

    }


    const handleModalSwitchClick = ()=>{
        setModalAllowedField( 1- modalAllowedField);
    }
    

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Áreas Comuns</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton 
                                onClick={handleAddButton} 
                                color="primary"
                                
                                >
                                <CIcon name="cil-check"/> Nova Área Comum
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
                                    'allowed':(item)=>(
                                        <td>
                                            <CSwitch
                                            color="success"
                                            checked={item.allowed}
                                            onChange={()=>handleSwitchClick(item)}/>
                                        </td>
                                    ),
                                    'cover':(item)=>(
                                        <td>
                                            <img src={item.cover} width={100}/>
                                        </td>
                                    ),
                                    'dates': (item)=>{
                                        let daysWords = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
                                        let days = item.days.split(',');
                                        let daysString = [];
                                        for(let i in days){
                                            if(days[i] && daysWords[days[i]]){
                                                daysString.push(daysWords[days[i]])
                                            }
                                        }
                                        return (
                                            <td>
                                                {daysString.join(', ')}
                                            </td>
                                        )
                                    },
                                    
                                    'actions':(item, index)=>(
                                        <td>
                                        <CButtonGroup>                                            
                                            <CButton color="info"  onClick={()=>handleEditButton(item.id)} >
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
            <CModalHeader closeButton>{modalId !==''? 'Editar': 'Nova'} Área Comum </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel htmlFor="modal_allowed">Ativo</CLabel><br/>
                    <CSwitch
                        color="success"
                        checked={modalAllowedField}
                        onChange={handleModalSwitchClick}
                        />
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal_title">Titulo</CLabel>
                    <CInput
                        type="text"
                        id='modal_title'
                        name="title"
                        value={modalTitleField}
                        onChange={(e)=>setModalTitleField(e.target.value)}
                    />                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal_cover">Capa</CLabel>
                    <CInput
                        type="file"
                        id='modal_cover'
                        name="cover"
                        placeholder="Escolha uma Imagem"
                        onChange={(e)=>setModalCoverField(e.target.files[0])}
                    />                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-days">Dias de Funcionamento</CLabel>
                    <div style={{marginLeft:20}}>
                        <div>
                            <CInputCheckbox
                                id="modal-days-0"
                                name="modal-days"
                                value={0}
                                checked={modalDaysField.includes('0')}
                                onChange={(e)=> toggleModalDays('0',e)}
                                />
                                <CLabel htmlFor="modal-days-0">Segunda-Feira</CLabel>
                        </div> 
                        <div>
                            <CInputCheckbox
                                id="modal-days-1"
                                name="modal-days"
                                value={1}
                                checked={modalDaysField.includes('1')}
                                onChange={(e)=> toggleModalDays('1',e)}
                                />
                                <CLabel htmlFor="modal-days-1">Terça-Feira</CLabel>
                        </div>
                        <div>
                            <CInputCheckbox
                                id="modal-days-2"
                                name="modal-days"
                                value={2}
                                checked={modalDaysField.includes('2')}
                                onChange={(e)=> toggleModalDays('2',e)}
                                />
                                <CLabel htmlFor="modal-days-2">Quarta-Feira</CLabel>
                        </div>
                        <div>
                            <CInputCheckbox
                                id="modal-days-3"
                                name="modal-days"
                                value={3}
                                checked={modalDaysField.includes('3')}
                                onChange={(e)=> toggleModalDays('3',e)}
                                />
                                <CLabel htmlFor="modal-days-3">Quinta-Feira</CLabel>
                        </div>
                        <div>
                            <CInputCheckbox
                                id="modal-days-4"
                                name="modal-days"
                                value={4}
                                checked={modalDaysField.includes('4')}
                                onChange={(e)=> toggleModalDays('4',e)}
                                />
                                <CLabel htmlFor="modal-days-4">Sexta-Feira</CLabel>
                        </div>
                        <div>
                            <CInputCheckbox
                                id="modal-days-5"
                                name="modal-days"
                                value={5}
                                checked={modalDaysField.includes('5')}
                                onChange={(e)=> toggleModalDays('5',e)}
                                />
                                <CLabel htmlFor="modal-days-5">Sábado-Feira</CLabel>
                        </div>
                        <div>
                            <CInputCheckbox
                                id="modal-days-6"
                                name="modal-days"
                                value={6}
                                checked={modalDaysField.includes('6')}
                                onChange={(e)=> toggleModalDays('6',e)}
                                />
                                <CLabel htmlFor="modal-days-6">Domingo-Feira</CLabel>
                        </div>   
                    </div>
                    
                </CFormGroup>

                <CFormGroup>
                    <CLabel htmlFor="modal-start-time">Horario de inicio</CLabel>
                    <CInput
                        type="time"
                        id="modal-start-time"
                        name="start_time"
                        value={modalStartTimeField}
                        onChange={e=>setModalStartTimeField(e.target.value)}
                    />               
                    
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="modal-end-time">Horario de fim</CLabel>
                    <CInput
                        type="time"
                        id="modal-end-time"
                        name="end_time"
                        value={modalEndTimeField}
                        onChange={e=>setModalEndTimeField(e.target.value)}
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
export default CommonAreas;