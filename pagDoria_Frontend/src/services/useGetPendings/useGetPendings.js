import { useContext, useState } from 'react';
import { GlobalContext } from '../../state/GlobalState';
import { REACT_APP_API_URL } from '../../utils/constanst';
export const useGetPendings = () => {
    const [pendings, setPendings] = useState([])
    const [error, setError] = useState(false)

    const {user} = useContext(GlobalContext)
    
    const getPendings = () => {
        const requestOptions = {
            method: 'GET'
        }
        fetch(`${REACT_APP_API_URL}/api/sheet/${user.subrol}/pendings`, requestOptions)
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