import { useContext, useState } from "react";
import { GlobalContext } from "../../state/GlobalState";
import { REACT_APP_API_URL } from "../../utils/constanst";

export const useEditServices = (cb, cbError, request) => {

    // console.log('request ->', request)
    const [error, setError] = useState('')

    const clearError = () => setError('')

    const validatorEditService = () => {
        if(request.estadoServicio !== 'Rechazado') {
            if(request.proovedor === '' || (request.COP === '' && request.USD === '' && request.EUR === '') || request.descripcionServicio === ''|| request.imputacionSolicita === ''|| request.nombreCotizacion === ''|| request.prioridad === ''|| request.imputacionAutoriza === '' || request.estadoServicio === '') {
                setError('Ingrese todos los espacios')
                return false
            }
            if(request.proovedor === 'OTROS ' && request.solicitudProveedor === ''){
                setError('Ingrese todos los espacios')
                return false
            }
        }
        return true
    }
    
    const {user} = useContext(GlobalContext)

    const subrol = user ? user.subrol : '';

    const editServices = () => {

        if(!validatorEditService()) {
            cbError()
            return 
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            headers: myHeaders,
            method: 'PUT',
            body: JSON.stringify(request),
            redirect: 'follow'
        };

        // console.log('body -->', requestOptions.body);

        // console.log('request.searcher',request.searcher)

        fetch(`${REACT_APP_API_URL}/api/edit/${subrol}/services/${"'"+request.searcher+"'"}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log('result',result)
            if(result.errorEdit){
                throw new Error(result.errorEdit)
            }
            cb()
        })
        .catch(errorEdit => console.log('error', errorEdit));

    };

    return {editServices, error, clearError, validatorEditService}
}