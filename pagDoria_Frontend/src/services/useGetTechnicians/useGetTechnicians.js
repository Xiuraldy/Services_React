import { useState } from 'react';
import { REACT_APP_API_URL } from '../../utils/constanst';

export const useGetTechnicians = () => {
    const [technicians, setTechnicians] = useState([])
    
    const getTechnicians = () => {
        let url = `${REACT_APP_API_URL}/api/technicians/sheet/services`
        
        const requestOptions = {
                method: 'GET'
            }
            fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                setTechnicians(result)
            },(error)=>{
                console.log(error)
        })
    }
    return {getTechnicians, technicians}
}