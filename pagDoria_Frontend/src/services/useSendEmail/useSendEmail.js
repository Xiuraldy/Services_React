import { BOSSES_EMAIL } from "../../utils/constanst";

export const useSendEmail = (request) => {
    const sendEmail = () => {
        emailjs.send("service_hprpkbd","template_xnd8ek8",{
            user_name: request.name,
            user_email: request.email,
            message: `Codigo: ${request.lastRow}</br>Proovedor: ${request.proovedor}`,
            id_service: request.lastRow,
            bosses_email: BOSSES_EMAIL[request.subrol]
        });
    } 
    return{sendEmail}
}