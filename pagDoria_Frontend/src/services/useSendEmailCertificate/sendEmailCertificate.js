import { BOSSES_EMAIL, FOLDERS_ID_CERTIFICATE, SHEET } from "../../utils/constanst";
import emailjs from '@emailjs/browser';

export const useSendEmailCertificate = (request) => {
    const sendEmailCertificate = (lastRow) => {
        emailjs.send("service_hprpkbd","template_pgp1561",{
            bosses_email: "xtrujillo762@misena.edu.co",
            user_email: request.email,
            user_name: request.name,
            message: `Proovedor: ${request.proovedor}
            Descripción: ${request.descripcionServicio}
            Número de Acta: ${request.file}
            Ubicación del Archivo: https://drive.google.com/drive/u/0/folders/${FOLDERS_ID_CERTIFICATE[request.subrol]}`,
            id_service: lastRow,
            user_area: SHEET[request.subrol],
            doorman_email: "ejquiroga@pastasdoria.com",
            user_soporing: "soporteingenieriaymontajes@pastasdoria.com",
        }, 'aKJDjVUed3jBUb8Qp')
        .then((result) => {
            console.log('SUCCESS!', result.text);
        }, (error) => {
            console.log('FAILED...', error.text);
        });
    } 
    return{sendEmailCertificate}
}