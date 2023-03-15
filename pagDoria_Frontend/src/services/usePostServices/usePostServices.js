import { useContext, useState } from "react";
import { GlobalContext } from "../../state/GlobalState";
import { REACT_APP_API_URL } from "../../utils/constanst";

export const usePostServices = (cb, request) => {

    // console.log('request ->', request)
    const [error, setError] = useState('')

    const clearError = () => setError('')

    const {user} = useContext(GlobalContext)

    const subrol = user ? user.subrol : '';
    const rol = user ? user.rol : '';

    const validatorPostService = () => {
        if(request.proovedor === '' || (request.COP === '' && request.USD === '' && request.EUR === '') || request.descripcionServicio === ''|| request.imputacionSolicita === ''|| request.nombreCotizacion === '') {
            setError('Ingrese todos los espacios')
            return false
        }
        if(request.proovedor === 'OTROS ' && request.solicitudProveedor === '') {
            setError('Ingrese todos los espacios')
            return false
        }
        if(rol === 'bosses'){
            if(request.prioridad === ''|| request.observacionAutoriza === ''|| request.imputacionAutoriza === '') {
                setError('Ingrese todos los espacios')
                return false
            }
        } 
        if(!request.file) {
            setError('Ingrese PDF Cotizacion')
            return false
        }

        if(request.isChecked === 'true' && !request.fileOuput) { 
            setError('Ingrese Acta de Entrega de Componente')
            return false
        }
        return true
    }
    
    const postServices = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            headers: myHeaders,
            method: 'POST',
            body: JSON.stringify(request),
            redirect: 'follow'
        };

        // console.log('body -->', requestOptions.body);

        fetch(`${REACT_APP_API_URL}/api/add/${subrol}/services`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.error){
                throw new Error(result.error)
            }
            cb()
        })
        .catch(error => console.log('error', error));

    };

    return {postServices, error, clearError, validatorPostService}
}