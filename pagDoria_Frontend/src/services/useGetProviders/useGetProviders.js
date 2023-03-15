import { useState } from 'react';
import { REACT_APP_API_URL } from '../../utils/constanst';

export const useGetProviders = () => {
    const [providers, setProviders] = useState([])
    
    const getProviders = () => {
        let url = `${REACT_APP_API_URL}/api/providers/sheet/services`
        // const expresionRegular = /\s*\n\s*/;
        
        const requestOptions = {
                method: 'GET'
            }
            fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                setProviders(result)
            },(error)=>{
                console.log(error)
        })
    }
    return {getProviders, providers}
}