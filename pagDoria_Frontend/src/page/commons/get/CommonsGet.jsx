import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button, Modal } from '@material-ui/core';
import { Autocomplete, TextField } from '@mui/material';
import { motion } from "framer-motion"
import { useContext, useState } from 'react';
import { usePostServices } from '../../../services/usePostServices/usePostServices';
import { GlobalContext } from '../../../state/GlobalState';
import './CommonsGet.css';
import { useUpploadFile } from '../../../services/useUpploadFile/useUpploadFile';
import { useGetAllSheets } from '../../../services/useGetSheets/useGetSheets';
import { useGetLastRow } from '../../../services/useGetLastRow/useGetLastRow';
import { useSendEmail } from '../../../services/useSendEmail/useSendEmail';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export const CommonsGet = () => {
    const {user} = useContext(GlobalContext)

    const {getValue} = useGetAllSheets()

    const {upploadFile} = useUpploadFile()

    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);

    const [proovedor, setProovedor] = useState('')
    const [solicitudProveedor, setSolicitudProveedor] = useState('')
    const [nombreCotizacion, setNombreCotizacion] = useState('')
    const [COP, setCOP] = useState('')
    const [USD, setUSD] = useState('')
    const [EUR, setEUR] = useState('')
    const [descripcionServicio, setDescripcionServicio] = useState('')
    const [imputacionSolicita, setImputacionSolicita] = useState('')
    const [prioridad, setPrioridad] = useState('')
    const [imputacionAutoriza, setImputacionAutoriza] = useState('')
    const [observacionesAutoriza, setObservacionesAutoriza] = useState('')
    const [file, setFile] = useState(null)

    // const [loading, setLoading] = useState(false)

    const [modalGet, setModalGet] = useState(false) 

    const completarHoraInicio = () => {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth()+1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        var hora = fecha.getHours(); //obteniendo hora
        var minutos = fecha.getMinutes(); //obteniendo minuto
        
        const datetime = minTwoDigits(dia)+"/"+minTwoDigits(mes)+"/"+ano+" "+minTwoDigits(hora)+":"+minTwoDigits(minutos);
        return datetime
    }
    
    const minTwoDigits = (n) => {
      return (n < 10 ? '0' : '') + n;
    }

    const rol = user ? user.rol : '';

    const {useLastRow, lastRow} = useGetLastRow(() => {
        setOpen(true)
        // setLoading(false)
    })

    const {postServices, error: errorPost, clearError} = usePostServices(useLastRow, {fechaSolicitud: completarHoraInicio(), proovedor, solicitudProveedor, nombreCotizacion, COP, USD, EUR, descripcionServicio, 
    imputacionSolicita, solicita: user ? user.name : '', fechaAprobacion: prioridad!=='' ? completarHoraInicio() : '', coordinadorAutoriza: prioridad!=='' ? user.name : '', 
    prioridad, imputacionAutoriza, observacionesAutoriza, file })

    const {sendEmail} = useSendEmail({user: user.name, email: user.name, lastRow: lastRow, proovedor: proovedor, subrol: user.subrol})

    const onModalGet = () => {
        setModalGet(!modalGet)
    }

    const handleClick = () => {
        // setLoading(true)
        upploadFile(file)
        postServices()
        sendEmail()
        setModalGet(false)
    };
    
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    
    setOpen(false);
    clearError()
    };

    return (
        <>
            <div className="content-get" name={rol}>
                <div className="form-get-services">
                        <div className="content-parts-form-get-services">
                            <div className="square-parts-form-get-services">
                                <div className="part-form-get-services-everyone">
                                    <h2>Proveedor<img src="/assets/getServices/provider.png" alt="provider" /></h2>
                                    <div className="select-other">
                                        <div className="select">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                value={proovedor}
                                                onChange={(e, newValue) => {
                                                    setProovedor(newValue ? newValue.value : '')
                                                }}
                                                options={[
                                                    { value: 'FERREINGENIERIA J M LTDA', label: 'FERREINGENIERIA J M LTDA'},
                                                    { value: 'ROPIM SAS', label: 'ROPIM SAS'},
                                                    { value: '1CREATIVOS SAS', label: '1CREATIVOS SAS'},
                                                    { value: 'EQUINEHY LTDA', label: 'EQUINEHY LTDA'},
                                                    { value: 'FYR INGENIEROS LTDA', label: 'FYR INGENIEROS LTDA'},
                                                    { value: 'INGENIERIA ESPECIALIZADA S.A', label: 'INGENIERIA ESPECIALIZADA S.A'},
                                                    { value: 'AUTOMATIZACION DE SISTEMAS S.A.S', label: 'AUTOMATIZACION DE SISTEMAS S.A.S'},
                                                    { value: 'KAESER COMPRESORES DE COLOMBIA', label: 'KAESER COMPRESORES DE COLOMBIA'},
                                                    { value: 'ACABADOS Y PINTURAS RODRIGUEZ S.A.S.', label: 'ACABADOS Y PINTURAS RODRIGUEZ S.A.S.'},
                                                    { value: 'HCM PINTURAS DE COLOMBIA SAS', label: 'HCM PINTURAS DE COLOMBIA SAS'},
                                                    { value: 'GDEM SAS', label: 'GDEM SAS'},
                                                    { value: 'WET CHEMICAL COLOMBIA S.A.S', label: 'WET CHEMICAL COLOMBIA S.A.S'},
                                                    { value: 'OSHO INGENIERIA LTDA', label: 'OSHO INGENIERIA LTDA'},
                                                    { value: 'ELECTROSISTEL JB S.A.S.', label: 'ELECTROSISTEL JB S.A.S.'},
                                                    { value: 'BUHLER A.G. SUIZA', label: 'BUHLER A.G. SUIZA'},
                                                    { value: 'BUHLER AG SUCURSAL COLOMBIA', label: 'BUHLER AG SUCURSAL COLOMBIA'},
                                                    { value: 'BUHLER S.A.S', label: 'BUHLER S.A.S'},
                                                    { value: 'AIT SOLUCIONES AUTOMATICAS S.A.S.', label: 'AIT SOLUCIONES AUTOMATICAS S.A.S.'},
                                                    { value: 'MEGAMONTAJES INDUSTRIALES SAS', label: 'MEGAMONTAJES INDUSTRIALES SAS'},
                                                    { value: 'BUHLER S.A.S', label: 'BUHLER S.A.S'},
                                                ]}
                                                renderInput={(params) => <TextField {...params} label="Nombre" />}
                                            />
                                        </div>
                                        {/* {console.log('proovedor -->', proovedor)} */}
                                        <div className="other">
                                            {proovedor === 'Otro' ? 
                                            <TextField 
                                                id="outlined-basic" 
                                                label="Otro" 
                                                variant="outlined" 
                                                onChange={(e) => setSolicitudProveedor(e.target.value)}
                                                value={solicitudProveedor}
                                            /> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="part-form-get-services-everyone" name="description">
                                    <h2>Descripción<img src="/assets/getServices/pencil.png" alt="provider" /></h2>
                                    <TextField 
                                        id="outlined-basic" 
                                        variant="outlined" 
                                        onChange={(e) => setDescripcionServicio(e.target.value)}
                                        value={descripcionServicio} 
                                        multiline
                                    />
                                </div>
                                <div className="part-form-get-services-everyone" name="quotation">
                                    <h2>Cotización<img src="/assets/getServices/price.png" alt="provider" /></h2>
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Nombre" 
                                        variant="outlined" 
                                        onChange={(e) => setNombreCotizacion(e.target.value)}
                                        value={nombreCotizacion}
                                    />
                                    <hr className='hr-quotation' />
                                    <div className="pdf-cotizacion">
                                        <img src="/assets/getServices/pdf.png" alt="provider" />
                                        <div className="pdf-name-pdf">
                                            <h3>PDF</h3>
                                            <input 
                                                type="file" 
                                                accept="application/pdf" 
                                                id="customFile" 
                                                onChange={(e) => setFile(e.target.files[0])} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="part-form-get-services-everyone" name="money">
                                    <div className="money-get-services">
                                        <h2>COP<img src="/assets/getServices/coin.png" alt="provider" /></h2>
                                        <TextField 
                                            id="outlined-basic" 
                                            sx={{ width: 130 }} 
                                            label="Valor" 
                                            variant="outlined"
                                            onChange={(e) => setCOP(e.target.value)}
                                        />
                                    </div>
                                    <div className="money-get-services">
                                        <h2>USD<img src="/assets/getServices/coin.png" alt="provider" /></h2>
                                        <TextField
                                            id="outlined-basic" 
                                            sx={{ width: 130 }} 
                                            label="Valor" 
                                            variant="outlined" 
                                            onChange={(e) => setUSD(e.target.value)}
                                            value={USD} 
                                        />
                                    </div>
                                    <div className="money-get-services">
                                        <h2>EUR<img src="/assets/getServices/coin.png" alt="provider" /></h2>
                                        <TextField 
                                            id="outlined-basic" 
                                            sx={{ width: 130 }} 
                                            label="Valor" 
                                            variant="outlined" 
                                            onChange={(e) => setEUR(e.target.value)}
                                            value={EUR} 
                                        />
                                    </div>
                                </div>
                                <div className="part-form-get-services-everyone" name="imputation-soli">
                                    <h2>Imputación Solicita<img src="/assets/getServices/imputation.png" alt="provider" /></h2>
                                    <div className="select-other">
                                        <div className="select">
                                            <TextField 
                                                id="outlined-basic" 
                                                variant="outlined" 
                                                label="Información"
                                                onChange={(e) => setImputacionSolicita(e.target.value)}
                                                value={imputacionSolicita} 
                                                multiline
                                            />
                                        </div>
                                    </div>
                                </div>
                                {rol === 'bosses' && (
                                    <>
                                        <div className="part-form-get-services-authorize">
                                            <h2>Prioridad<img src="/assets/getServices/priority.png" alt="provider" /></h2>
                                            <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        value={prioridad}
                                                        onChange={(e, newValue) => {
                                                            console.log('newValue ', newValue)
                                                            setPrioridad(newValue ? newValue.value : '')
                                                        }}
                                                        options={[
                                                            { value: 'BAJA', label: 'BAJA' },
                                                            { value: 'MEDIA', label: 'MEDIA' },
                                                            { value: 'ALTA', label: 'ALTA' }
                                                        ]}
                                                        renderInput={(params) => <TextField {...params} label="Estado" />}
                                                    />
                                        </div>
                                        <div className="part-form-get-services-authorize" name="observation">
                                            <h2>Observación<img src="/assets/getServices/observation.png" alt="provider" /></h2>
                                            <TextField 
                                                id="outlined-basic"  
                                                variant="outlined" 
                                                onChange={(e) => setObservacionesAutoriza(e.target.value)}
                                                value={observacionesAutoriza}
                                                multiline
                                            />
                                        </div>
                                        <div className="part-form-get-services-authorize">
                                            <h2>Imputación Autoriza<img src="/assets/getServices/imputation.png" alt="provider" /></h2>
                                            <div className="select-other">
                                                <div className="select">
                                                    <TextField 
                                                        id="outlined-basic" 
                                                        variant="outlined" 
                                                        label="Información"
                                                        onChange={(e) => setImputacionAutoriza(e.target.value)}
                                                        value={imputacionAutoriza} 
                                                        multiline
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* <div className="part-form-get-services-reliability">
                                    <h2>Solped<img src="/assets/getServices/solped.png" alt="provider" /></h2>
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Número" 
                                        type="number" 
                                        variant="outlined" 
                                        onChange={(e) => setSolped(e.target.value)}
                                        value={solped}
                                    />
                                </div>
                                <div className="part-form-get-services-reliability">
                                    <h2>Orden de Compra<img src="/assets/getServices/order.png" alt="provider" /></h2>
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Número" 
                                        type="number" 
                                        variant="outlined" 
                                        onChange={(e) => setOrdenCompra(e.target.value)}
                                        value={ordenCompra}
                                    />
                                    <input 
                                        type="file" 
                                        accept="application/pdf" 
                                        id="customFile" 
                                        onChange={(e) => setPDFOrdenCompra(e.target.value)}
                                        value={PDFOrdenCompra}
                                    />
                                </div>
                                <div className="part-form-get-services-reliability">
                                    <h2>Estado<img src="/assets/getServices/state.png" alt="provider" /></h2>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        onChange={(e) => setEstado(e.target.value)}
                                        options={[
                                            { value: 'Sin liberar', label: 'Sin liberar'},
                                            { value: 'CONTRATO MARCO', label: 'CONTRATO MARCO'},
                                            { value: 'Liberado', label: 'Liberado'}
                                        ]}
                                        // value={estado}
                                        renderInput={(params) => <TextField {...params} label="Nivel"  value="states" />}
                                    />
                                </div>
                                <div className="part-form-get-services-reliability">
                                    <h2>Facturación de Servicio<img src="/assets/getServices/invoce.png" alt="provider" /></h2>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        onChange={(e) => setFacturacionServicio(e.target.value)}
                                        options={[
                                            { value: 'Sin facturar', label: 'Sin facturar'},
                                            { value: 'Parcial', label: 'Parcial'},
                                            { value: 'Facturado', label: 'Facturado'}
                                        ]}
                                        // value={facturacionServicio}
                                        renderInput={(params) => <TextField {...params} label="Estado"  value="invoce" />}
                                    />
                                </div> */}
                                </div>
                                <div className="area-send">
                                {/* {console.log('subrolPost ->', subrolPost)} */}
                                <button className='button-add' onClick={onModalGet}>ENVIAR</button>
                                <Modal open={modalGet} close={onModalGet}>
                                    <motion.div
                                        className="container"
                                        initial={{ scale: .5, y:200, rotate:80 }}
                                        animate={{ rotate:0, scale: 1 }}
                                        transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                    }}>
                                        <div className='modal'>
                                        <div className='modal-title'>
                                            <h2>Enviar Servicio</h2>
                                        </div>
                                        <p className='pModalDelete'>¿Desea confirmar el envio de su servicio?</p>
                                        <div className='modal-buttons'>
                                            <Button color="Primary" onClick={handleClick}>Enviar</Button>
                                            <Button onClick={()=>setModalGet(false)}>Cancelar</Button>
                                        </div>
                                    </div></motion.div>
                                </Modal>
                            </div>
                        </div>
                </div>
            </div>
            <div className="css-cpgvjg-MuiSnackbar-root">
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', marginLeft: '740px' }}>
                                Servicio Realizado Con Exito - CODIGO: {lastRow}
                            </Alert>
                    </Snackbar>
                </Stack>
                

                <Stack spacing={2} sx={{ width: '100%', marginLeft: '50px' }}>
                    <Snackbar open={!!errorPost} autoHideDuration={5000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%', marginLeft: '740px' }}>
                                <p>{errorPost}</p>
                            </Alert>
                    </Snackbar>
                </Stack>
                
            </div>
            </>
    );
}