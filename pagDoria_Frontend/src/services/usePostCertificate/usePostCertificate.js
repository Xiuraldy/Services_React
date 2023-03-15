import { useContext, useState } from "react";
import { GlobalContext } from "../../state/GlobalState";
import { REACT_APP_API_URL } from "../../utils/constanst";

export const usePostCertificate = (cb, request) => {

    // console.log('request ->', request)
    const [error, setError] = useState('')

    const clearError = () => setError('')

    const {user} = useContext(GlobalContext)

    const subrol = user ? user.subrol : '';

    // console.log('rol -->', rol)
    const validatorPostCertificate = () => {

        if(request.provider === "OTROS " && !request.newProvider) {
            setError('Ingrese todos los espacios')
            return false
        }
    
        if(!request.component || !request.codigoSAP || !request.machine || !request.units || !request.brand || !request.provider || !request.quotation || !request.deliverDate || !request.numberDeliveryTechnician) {
            setError('Ingrese todos los espacios')
            return false
        }

        console.log('request.numberDeliveryTechnician',request.numberDeliveryTechnician)

        if(request.numberDeliveryTechnician === 1 && !request.deliveryTechnician1) {
            setError('Ingrese todos los espacios')
            return false
        }

        if(request.numberDeliveryTechnician === 2) {
            if(!request.deliveryTechnician1) {
                setError('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician2) {
                setError('Ingrese todos los espacios')
                return false
            }
        }

        if(request.numberDeliveryTechnician === 3) {
            if(!request.deliveryTechnician1) {
                setError('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician2) {
                setError('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician3) {
                setError('Ingrese todos los espacios')
                return false
            }
        }
        return true
    }
    
    const postCertificate = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            headers: myHeaders,
            method: 'POST',
            body: JSON.stringify(request),
            redirect: 'follow'
        };

        // console.log('body -->', requestOptions.body);

        fetch(`${REACT_APP_API_URL}/api/add/certificate/${subrol}/services`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.error){
                throw new Error(result.error)
            }
            cb()
        })
        .catch(error => console.log('error', error));

    };

    return {postCertificate, error, clearError, validatorPostCertificate}
}