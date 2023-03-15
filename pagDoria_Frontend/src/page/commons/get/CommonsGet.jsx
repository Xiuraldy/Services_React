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
import { useGetLastRow } from '../../../services/useGetLastRow/useGetLastRow';
import { useSendEmail } from '../../../services/useSendEmail/useSendEmail';
import { useGetProviders } from '../../../services/useGetProviders/useGetProviders';
import { useEffect } from 'react';
import { FOLDERS_ID, FOLDERS_ID_CERTIFICATE } from '../../../utils/constanst';
import { useSendEmailCertificate } from '../../../services/useSendEmailCertificate/sendEmailCertificate';
import { useGetDateTime } from '../../../services/useGetDateTime/useGetDateTime';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export const CommonsGet = () => {
    const {user} = useContext(GlobalContext)

    const {upploadFile} = useUpploadFile()

    const [open, setOpen] = React.useState(false);

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
    const [fileOuput, setFileOuput] = useState(null)

    const [loading, setLoading] = useState(false)

    const [modalGet, setModalGet] = useState(false) 

    const [isChecked, setIsChecked] = useState(false);
    
    const {getDateTime} = useGetDateTime()

    const rol = user ? user.rol : '';

    const fileOuputName = fileOuput ? fileOuput.name.split(".")[0] : ''
 
    const {sendEmail} = useSendEmail({name: user ? user.name : '', email: user ? user.email: '', subrol: user ? user.subrol: '', fechaSolicitud: getDateTime(), proovedor: proovedor,
    COP: COP, USD: USD, EUR: EUR, descripcionServicio: descripcionServicio, imputacionSolicita: imputacionSolicita, prioridad: prioridad, 
    imputacionAutoriza: imputacionAutoriza, observacionesAutoriza: observacionesAutoriza, fechaAprobacion: prioridad!=='' ? getDateTime() : '', estadoServicio: prioridad!=='' ? 'Aprobado' : 'Pendiente', númeroActa: fileOuputName})
    
    const {sendEmailCertificate} = useSendEmailCertificate({name: user ? user.name : '', proovedor: proovedor, descripcionServicio: descripcionServicio, email: user ? user.email: '', subrol: user ? user.subrol: '', file: fileOuputName})
    
    const {useLastRow, lastRow} = useGetLastRow((value) => {
        setOpen(true)
        sendEmail(value)
        sendEmailCertificate(value)
        setLoading(false)
    })

    const {getProviders, providers} = useGetProviders()

    useEffect(() => {
        getProviders()
        // eslint-disable-next-line
    }, [])
    
    const {postServices, error: errorPost, clearError, validatorPostService} = usePostServices(useLastRow, {fechaSolicitud: getDateTime(), proovedor: proovedor, 
    solicitudProveedor: proovedor !== 'OTROS ' ? '' : solicitudProveedor, nombreCotizacion: nombreCotizacion, COP: COP, USD: USD, EUR: EUR, descripcionServicio: descripcionServicio, 
    imputacionSolicita: imputacionSolicita, solicita: user ? user.name : '', fechaAprobacion: prioridad!=='' ? getDateTime() : '', coordinadorAutoriza: prioridad!=='' ? user.name : '', 
    prioridad: prioridad, imputacionAutoriza: imputacionAutoriza, observacionesAutoriza: observacionesAutoriza, estadoServicio: prioridad!=='' ? 'Aprobado' : 'Pendiente', ejecuciónServicio: 'Por Ejecutar', númeroActa: fileOuputName, file, fileOuput, isChecked: isChecked.toString() })
        
    const onModalGet = () => {
        setModalGet(!modalGet)
    }

    const handleClick = () => {
        if(!validatorPostService()){
            setModalGet(false)
            return
        }
        setLoading(true)
        upploadFile(file, FOLDERS_ID[user.subrol])
        upploadFile(fileOuput, FOLDERS_ID_CERTIFICATE[user.subrol])
        postServices()
        setModalGet(false)
    };
    
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    
    setOpen(false);
    clearError()
    };
    
    const handleOnChange = () => {
        setIsChecked(!isChecked);
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
                                                options={providers.map((providerItem) => {
                                                    return {value: providerItem.proveedores, label: providerItem.proveedores}
                                                })}
                                                renderInput={(params) => <TextField {...params} label="Nombre" />}
                                                isOptionEqualToValue={(option, value) =>
                                                    value === undefined || value === "" || option.id === value.id
                                                }
                                                onChange={(e, newValue) => {
                                                    setProovedor(newValue ? newValue.value : '')
                                                }}
                                            />
                                        </div>
                                        {/* {console.log('proovedor -->', proovedor)} */}
                                        <div className="other">
                                            {proovedor === 'OTROS ' ? 
                                            <TextField 
                                                id="outlined-basic" 
                                                label="Nuevo Proveedor" 
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
                                            type="text"

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
                                            type="text"
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
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="part-form-get-services-everyone" name="imputation-soli">
                                    <h2>Imputación Solicitud<img src="/assets/getServices/imputation.png" alt="provider" /></h2>
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
                                                options={[
                                                    { value: 'BAJA', label: 'BAJA' },
                                                    { value: 'MEDIA', label: 'MEDIA' },
                                                    { value: 'ALTA', label: 'ALTA' }
                                                ]}
                                                renderInput={(params) => <TextField {...params} label="Estado" />}
                                                isOptionEqualToValue={(option, value) =>
                                                    value === undefined || value === "" || option.id === value.id
                                                }
                                                onChange={(e, newValue) => {
                                                    setPrioridad(newValue ? newValue.value : '')
                                                }}
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
                                            <h2>Imputación Autorizado<img src="/assets/getServices/imputation.png" alt="provider" /></h2>
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
                                <div className="part-form-get-services-documentExit" name={isChecked.toString()}>
                                    <h2>Salida del Componente<img src="/assets/getServices/exit.png" alt="provider" /></h2>
                                    <h4>¿El Equipo/Componente será llevado por el proveedor?
                                        <input
                                        type="checkbox"
                                        className='checkbox-exit'
                                        value="Paneer"
                                        checked={isChecked}
                                        onChange={handleOnChange}
                                        />
                                    </h4>
                                </div>
                                <div className="part-form-get-services-documentExitPDF" name={isChecked.toString()}>
                                    <h2>Acta de Entrega de Componente<img src="/assets/getServices/documentExit.png" alt="documentExit" /></h2>
                                    <input 
                                        type="file" 
                                        accept="application/pdf" 
                                        id="customFile" 
                                        onChange={(e) => setFileOuput(e.target.files[0])} 
                                    />
                                </div>
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
                                        options={[
                                            { value: 'Sin liberar', label: 'Sin liberar'},
                                            { value: 'CONTRATO MARCO', label: 'CONTRATO MARCO'},
                                            { value: 'Liberado', label: 'Liberado'}
                                        ]}
                                        // value={estado}
                                        renderInput={(params) => <TextField {...params} label="Nivel"  value="states" />}
                                        isOptionEqualToValue={(option, value) =>
                                                    value === undefined || value === "" || option.id === value.id
                                        }
                                        onChange={(e) => setEstado(e.target.value)}
                                    />
                                </div>
                                <div className="part-form-get-services-reliability">
                                    <h2>Facturación de Servicio<img src="/assets/getServices/invoce.png" alt="provider" /></h2>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={[
                                            { value: 'Sin facturar', label: 'Sin facturar'},
                                            { value: 'Parcial', label: 'Parcial'},
                                            { value: 'Facturado', label: 'Facturado'}
                                        ]}
                                        // value={facturacionServicio}
                                        renderInput={(params) => <TextField {...params} label="Estado"  value="invoce" />}
                                        isOptionEqualToValue={(option, value) =>
                                            value === undefined || value === "" || option.id === value.id
                                        }
                                        onChange={(e) => setFacturacionServicio(e.target.value)}
                                    />
                                </div> */}
                                </div>
                                <div className="area-send">
                                {/* {console.log('subrolPost ->', subrolPost)} */}
                                <button className='button-add' onClick={onModalGet} disabled={loading}>ENVIAR</button>
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
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', marginLeft: '405px', marginBottom: '10px' }}>
                                Servicio Realizado Con Exito - CODIGO: {lastRow}
                            </Alert>
                    </Snackbar>
                </Stack>
                

                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={!!errorPost} autoHideDuration={5000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%', marginLeft: '405px', marginBottom: '10px' }}>
                                <p>{errorPost}</p>
                            </Alert>
                    </Snackbar>
                </Stack>
                
            </div>
            </>
    );
}