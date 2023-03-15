import { BOSSES_EMAIL, SHEET } from "../../utils/constanst";
import emailjs from '@emailjs/browser';

export const useSendEmail = (request) => {
    const sendEmail = (lastRow) => {
        emailjs.send("service_hprpkbd","template_gz8y875",{
            user_name: request.name,
            user_email: request.email,
            message: `Fecha de Creación: ${request.fechaSolicitud}
            Codigo de Servicio: ${lastRow}
            Proovedor: ${request.proovedor}
            Descripción: ${request.descripcionServicio}
            COP: ${request.COP} / USD: ${request.USD} / EUR: ${request.EUR}
            Imputación: ${request.imputacionSolicita} / ${request.imputacionAutoriza}
            Fecha de Aprobación: ${request.fechaAprobacion}
            Prioridad: ${request.prioridad}
            Estado: ${request.estadoServicio}
            Observaciones: ${request.observacionesAutoriza}`,
            id_service: lastRow,
            user_area: SHEET[request.subrol],
            bosses_email: BOSSES_EMAIL[request.subrol]
        }, 'aKJDjVUed3jBUb8Qp')
        .then((result) => {
            console.log('SUCCESS!', result.text);
        }, (error) => {
            console.log('FAILED...', error.text);
        });
    } 
    return{sendEmail}
}