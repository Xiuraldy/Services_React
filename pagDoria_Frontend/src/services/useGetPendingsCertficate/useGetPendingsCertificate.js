import { useState } from 'react';
import { REACT_APP_API_URL } from '../../utils/constanst';

export const useGetPendingsCertificate = () => {
    const [pendings, setPendings] = useState([])
    const [error, setError] = useState(false)
    
    const getPendings = () => {
        const requestOptions = {
            method: 'GET'
        }
        fetch(`${REACT_APP_API_URL}/api/pendings/certificate`, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                // console.log('result pending',result)
                if(result.length){
                    setPendings(result)
                    setError(false)
                }else {
                    setError(true)
                }
        },(error)=>{
            console.log(error)
        })
    }
    return {getPendings, setPendings, pendings, error}
}