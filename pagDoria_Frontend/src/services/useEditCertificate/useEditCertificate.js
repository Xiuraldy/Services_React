import { useState } from "react";
// import { GlobalContext } from "../../state/GlobalState";
import { REACT_APP_API_URL } from "../../utils/constanst";

export const useEditCertificate = (cb, cbError, request) => {

    // console.log('request ->', request)
    const [errorCertificate, setErrorCertificate] = useState('')

    const clearErrorCertificate = () => setErrorCertificate('')

    const validatorEditCertificate = () => {
        if(request.provider === "OTROS " && !request.newProvider) {
            setErrorCertificate('Ingrese todos los espacios')
            return false
        }
    
        if(!request.component || !request.codigoSAP || !request.machine || !request.units || !request.brand || !request.provider || !request.quotation || !request.deliverDate || !request.numberDeliveryTechnician) {
            setErrorCertificate('Ingrese todos los espacios')
            return false
        }

        console.log('request.numberDeliveryTechnician',request.numberDeliveryTechnician)

        if(request.numberDeliveryTechnician === 1 && !request.deliveryTechnician1) {
            setErrorCertificate('Ingrese todos los espacios')
            return false
        }

        if(request.numberDeliveryTechnician === 2) {
            if(!request.deliveryTechnician1) {
                setErrorCertificate('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician2) {
                setErrorCertificate('Ingrese todos los espacios')
                return false
            }
        }

        if(request.numberDeliveryTechnician === 3) {
            if(!request.deliveryTechnician1) {
                setErrorCertificate('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician2) {
                setErrorCertificate('Ingrese todos los espacios')
                return false
            }
            if(!request.deliveryTechnician3) {
                setErrorCertificate('Ingrese todos los espacios')
                return false
            }
        }
        return true
    }
    
    // const {user} = useContext(GlobalContext)
    // const subrol = user ? user.subrol : '';

    const editCertificate = () => {

        if(!validatorEditCertificate()) {
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

        //console.log('request.id',request.id)

        fetch(`${REACT_APP_API_URL}/api/edit/certificate/${"'"+request.idSearch+"'"}`, requestOptions)
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

    return {editCertificate, errorCertificate, clearErrorCertificate, validatorEditCertificate}
}