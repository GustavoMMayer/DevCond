import React, {useState, useEffect} from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { 
    
    CButton,
    CCard, 
    CCardBody, 
    CCol, 
    CDataTable, 
    CRow, 
    CSwitch, 
    
}from '@coreui/react';

import useApi from '../Services/api'



const Foundandlost = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [photoUrl, setPhotoUrl] = useState('');
    
    
    

    const fields =[
        {label:'Recuperado', key: 'status', filter: false},
        {label:'Local', key: 'where', sorter:false},  
        {label:'Descrição', key: 'description', sorter: false},  
        {label:'Foto', key: 'photo', filter: false, sorter: false},  
        {label:'Data', key: 'datecreated'},    
       
    ]

    useEffect(()=>{
        getList();
      
    },[]);

    const getList = async()=>{
        setLoading(true);
        const result = await api.getFoundandlost();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
    
    const handleSwitchClick = async(item) =>{
        setLoading(true)
        const result = await api.updateFoundandlost(item.id)
        setLoading(false)

        if(result.error === '' || result.error !== undefined){
            getList();
        }else{
            alert(result.error)
        }

    }

    const showLightbox = (url) =>{
        setPhotoUrl(url);
    }
        

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Achados e Perdidos</h2>

                    <CCard>
                        

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
                                    'photo': (item) =>(
                                        <td>
                                           {item.photo &&
                                           <CButton color="success" onClick={()=>showLightbox(item.photo)}>
                                                 Ver foto
                                           </CButton> }
                                        </td>
                                    ),
                                    'datecreated': (item) =>(
                                        <td>
                                            {item.datecreated_formatted}
                                        </td>
                                    ),
                                    'status':(item) =>(
                                        <td>
                                            <CSwitch
                                            color='success'
                                            checked={item.status === 'recovered'}
                                            onChange={()=>handleSwitchClick(item)}/>

                                            
                                        </td>
                                    )
                                }}

                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {photoUrl &&
            
            <Lightbox
                mainSrc={photoUrl}
                onCloseRequest={()=>setPhotoUrl('')}
                reactModalStyle ={{overlay:{zIndex:9999}}}
                
            />
            }

        
        </>
    )


};
export default Foundandlost;