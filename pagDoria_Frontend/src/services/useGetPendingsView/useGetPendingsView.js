import { useContext, useState } from 'react';
import { GlobalContext } from '../../state/GlobalState';
import { REACT_APP_API_URL } from '../../utils/constanst';
export const useGetPendingsView = () => {
    const [pendingsView, setPendingsView] = useState([])
    const [error, setError] = useState(false)

    const {user} = useContext(GlobalContext)
    
    const getPendingsView = () => {
        const requestOptions = {
            method: 'GET'
        }
        fetch(`${REACT_APP_API_URL}/api/sheet/${user.subrol}/pendings/view`, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                // console.log('result pending',result)
                if(result.length){
                    setPendingsView(result)
                    setError(false)
                }else {
                    setError(true)
                }
        },(error)=>{
            console.log(error)
        })
    }
    return {getPendingsView, setPendingsView, pendingsView, error}
}