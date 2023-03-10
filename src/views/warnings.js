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



const Warnings = ()=>{
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [photoList, setPhotoList] = useState([]);
    const [photoListIndex, setPhotoListIndex] = useState(0);
    
    

    const fields =[
        {label:'Resolvido', key: 'status'},  
        {label:'Unidade', key:'name_unit', sorter:false},
        {label: 'Titulo', key: 'title', sorter:false},
        {label: 'Fotos', key: 'photos', sorter: false, filter:false},
        {label: 'Data', key:'datecreated'}
    ]

    useEffect(()=>{
        getList();
      
    },[]);

    const getList = async()=>{
        setLoading(true);
        const result = await api.getWarnings();
        setLoading(false);
        
        if(result.error ==='' || result.error === undefined){
            setList(result.list);
        }else{
            alert(result.error)
        }
        
    }
    
    const handleSwitchClick = async(item) =>{
        setLoading(true)
        const result = await api.updadeWarning(item.id)
        setLoading(false)

        if(result.error === '' || result.error !== undefined){
            getList();
        }else{
            alert(result.error)
        }

    }

    const showLightbox = (photos) =>{
        setPhotoListIndex(0);
        setPhotoList(photos);
    }
        

    return(
        <>
            <CRow>
                <CCol>
                    <h2>OcorrĂȘncias</h2>

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
                                    'photos': (item) =>(
                                        <td>
                                           {item.photos.length >0 &&
                                           <CButton color="success" onClick={()=>showLightbox(item.photos)}>
                                                 {item.photos.length} {item.photos.length !==1? 'Fotos':'Foto'}
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
                                            checked={item.status === 'RESOLVED'}
                                            onChange={()=>handleSwitchClick( item)}/>

                                            
                                        </td>
                                    )
                                }}

                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {photoList.length > 0 &&
            
            <Lightbox
                mainSrc={photoList[photoListIndex]}
                nextSrc={photoList[photoListIndex+1]}
                prevSrc= {photoList[photoListIndex-1]}
                onCloseRequest={()=>setPhotoList([])}
                onMovePrevRequest ={()=>{
                    if(photoList[photoListIndex-1] !== undefined){
                        setPhotoListIndex(photoListIndex-1)
                    }
                }}
                onMoveNextRequest ={()=>{
                    if(photoList[photoListIndex+1] !== undefined){
                        setPhotoListIndex(photoListIndex+1)
                    }
                }}
                reactModalStyle ={{overlay: {zIndex:9999}}}
            />}

        
        </>
    )


};
export default Warnings;