import * as React from 'react';
import './CommonsDepartureCertificate.css';
import { Button, Modal, Snackbar, TextField } from "@material-ui/core"
import { motion } from "framer-motion";
import { renderToString } from "react-dom/server";
import { useContext, useState } from "react"
import jsPDF from 'jspdf';
import { useGetDateTime } from '../../../services/useGetDateTime/useGetDateTime';
import { GlobalContext } from '../../../state/GlobalState';
import { usePostCertificate } from '../../../services/usePostCertificate/usePostCertificate';
import { useGetLastrowCertificate } from '../../../services/useGetLastrowCertificate/useGetLastrowCerticicate';
import { SHEET } from '../../../utils/constanst';
import { Alert, Autocomplete, Stack } from '@mui/material';
import { HtmlTooltip } from '../../../elements/TooltipReuse';
import { useEffect } from 'react';
import { useGetAllCertificates } from '../../../services/useGetCertificates/useGetCertificates';
import { useGetPendingsCertificate } from '../../../services/useGetPendingsCertficate/useGetPendingsCertificate';
import { useEditCertificate } from '../../../services/useEditCertificate/useEditCertificate';
import { useGetProviders } from '../../../services/useGetProviders/useGetProviders';
import { useGetTechnicians } from '../../../services/useGetTechnicians/useGetTechnicians';

export const CommonsDepartureCertificate = () => {

    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const {user} = useContext(GlobalContext)
    const rol = user ? user.rol : '';
    // const name = user ? user.name : '';

    const [date, setDate] = useState('');
    const [component, setComponent] = useState('');
    const [codigoSAP, setCodigoSAP] = useState('');
    const [machine, setMachine] = useState('');
    const [units, setUnits] = useState('');
    const [brand, setBrand] = useState('');
    const [reference, setReference] = useState('');
    const [plate, setPlate] = useState('');
    const [vol, setVol] = useState('');
    const [kw, setKw] = useState('');
    const [rpm, setRpm] = useState('');
    const [amp, setAmp] = useState('');
    const [diameter, setDiameter] = useState('');
    const [broad, setBroad] = useState('');
    const [high, setHigh] = useState('');
    const [long, setLong] = useState('');
    const [weight, setWeight] = useState('');
    const [other, setOther] = useState('');
    const [provider, setProvider] = useState('');
    const [newProvider, setNewProvider] = useState('');
    const [quotation, setQuotation] = useState('');
    const [deliverDate, setDeliverDate] = useState('');
    const [inCharge, setInCharge] = useState('');
    const [bosses, setBosses] = useState('');
    const [numberDeliveryTechnician, setNumberDeliveryTechnician] = useState('')
    const [deliveryTechnician1, setDeliveryTechnician1] = useState('');
    const [deliveryTechnician2, setDeliveryTechnician2] = useState('');
    const [deliveryTechnician3, setDeliveryTechnician3] = useState('');
    //Concatenar Los Técnicos de Entrega
    const deliveryTechnician2Concatenated = deliveryTechnician2 ? ' / '+deliveryTechnician2 : ''
    const deliveryTechnician3Concatenated = deliveryTechnician3 ? ' / '+deliveryTechnician3 : ''
    const deliveryTechnician = deliveryTechnician1 + deliveryTechnician2Concatenated + deliveryTechnician3Concatenated
    const [loading, setLoading] = useState(false)

    const {getAllCertificates, searcher, setSearcher, getValue, error} = useGetAllCertificates()

    useEffect(() => {
        setDate(getValue.date)
        setComponent(getValue.component)
        setCodigoSAP(getValue.codigoSAP)
        setMachine(getValue.machine)
        setUnits(getValue.units)
        setBrand(getValue.brand)
        setReference(getValue.reference)
        setPlate(getValue.plate)
        setVol(getValue.vol)
        setKw(getValue.kw)
        setRpm(getValue.rpm)
        setAmp(getValue.amp)
        setDiameter(getValue.diameter)
        setBroad(getValue.broad)
        setHigh(getValue.high)
        setLong(getValue.long)
        setWeight(getValue.weight)
        setOther(getValue.other)
        setProvider(getValue.provider)
        setNewProvider(getValue.newProvider)
        setQuotation(getValue.quotation)
        setDeliverDate(getValue.deliverDate)
        setNumberDeliveryTechnician(getValue.numberDeliveryTechnician)
        setDeliveryTechnician1(getValue.deliveryTechnician1)
        setDeliveryTechnician2(getValue.deliveryTechnician2)
        setDeliveryTechnician3(getValue.deliveryTechnician3)
        setInCharge(getValue.inCharge)
        setBosses(getValue.bosses)
    }, [getValue])

    //console.log('getValue.numberDeliveryTechnician',getValue.numberDeliveryTechnician)

    useEffect(() => {
        if(user){
            getAllCertificates()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // 👇 Get input value
            getAllCertificates()
        }
    };

    const {getProviders, providers} = useGetProviders()
    const {getTechnicians, technicians} = useGetTechnicians()

    useEffect(() => {
        getProviders()
        getTechnicians()
        // eslint-disable-next-line
    }, [])

    const [modalCertificate, setModalCertificate] = useState(false)
    const [modalCertificateAuthorize, setModalCertificateAuthorize] = useState(false)
    const [modalCertificateSend, setModalCertificateSend] = useState(false)

    const onModalCertificate = () => {
        setModalCertificate(!modalCertificate)
    }

    const onModalCertificateAuthorize = () => {
        setModalCertificateAuthorize(!modalCertificateAuthorize)
    }

    const onModalCertificateSend = () => {
        setModalCertificateSend(!modalCertificateSend)
    }

    const {getDateTime} = useGetDateTime()
    
    const Prints = ({name}) => (
        <div className="pdf-departure-certificate">
            <div className="content-departure-certificate" name="certificate">
                <div className="form-departure-certificate" name="certificate">
                    <div className="title-form-departure-certificate" name="title-pdf">
                        <h2>Acta de Entrega<br/>de Componente</h2>
                    </div>
                    <div className="departure-form-departure-certificate">
                        <div className="caption-form-departure-certificate" name="departure">
                                <h1>Salida<br/>No. {name}</h1>
                        </div>
                    </div>
                    <div className="date-form-departure-certificate" name="pdf">
                            Fecha de Creación<br/>{date}
                    </div>
                    <div className="logo-form-departure-certificate">
                        <img src="/assets/logo/logo_doria.png" alt="" />
                    </div>
                    <div className="item-form-departure-certificate" name="caption-main-dates-certificate">
                        <div className="caption-form-departure-certificate" name="caption-main">
                            Datos Básicos
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">    
                        <div className="caption-form-departure-certificate" name="pdf">
                            Nombre Componente 
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {component}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Codigo SAP 
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {codigoSAP}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Equipo - Zona de uso del componente
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {machine}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Unidades Enviadas
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {units}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Marca
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {brand}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="caption-main-other-certificate">
                        <div className="caption-form-departure-certificate" name="caption-main">
                            Especifiaciones
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="reference">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Referencia
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {reference}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="plate">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Placa Equipo
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {plate}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            VOL
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {vol}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            KW
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {kw}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="rpm">
                        <div className="caption-form-departure-certificate" name="pdf">
                            R . P . M
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {rpm}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            AMP
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {amp}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Diametro
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {diameter}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Ancho
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {broad}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others"> 
                        <div className="caption-form-departure-certificate" name="pdf">
                            Alto
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {high}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Largo
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {long}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="others">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Peso
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {weight}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf" id="other">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Otras Especifiaciones
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {other}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate"></div>
                    <div className="item-form-departure-certificate" name="caption-main-authorize-certificate">
                        <div className="caption-form-departure-certificate" name="caption-main">
                            Autorización de Salida
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Proveedor 
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {provider ? provider : newProvider}
                        </div>
                    </div>
                    {/* { provider === 'OTROS ' ?
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Nuevo Proveedor 
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {newProvider}
                        </div>
                    </div>
                    : ''} */}
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Cotización
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {quotation}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Fecha de Entrega
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {deliverDate}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf"></div>
                    <div className="item-form-departure-certificate" name="pdf"></div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Entrega Técnico 
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {deliveryTechnician}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Lider a Cargo
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {inCharge}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf">
                        <div className="caption-form-departure-certificate" name="pdf">
                            Autorización
                        </div>
                        <div className="input-form-departure-certificate" name="pdf">
                            {bosses}
                        </div>
                    </div>
                    <div className="item-form-departure-certificate" name="pdf"></div>
                </div>
                <div className="signature-certificate">
                    <hr className="hr-signature-certificate"/>
                    <h2>Firma Del Proveedor</h2>
                </div>
            </div>
        </div>
    )

    const print = (value) => {
        const doc = new jsPDF('l', 'mm', [2000, 1800]);

        const string = renderToString(<Prints name={value} />);

        doc.html(string, {
            callback: function(doc) {
                doc.save(`${value}.pdf`);
            }
        }, {align: "center"});
    }

    const {useLastRow, lastRow} = useGetLastrowCertificate((value) => {
        setOpen(true)
        setLoading(false)
    })

    const {postCertificate, error: errorPost, clearError, validatorPostCertificate} = usePostCertificate(useLastRow, { 
        date: getDateTime(), 
        component: component, 
        area: SHEET[user ? user.subrol : ''],
        codigoSAP: codigoSAP,
        machine: machine,
        units: units,
        brand: brand,
        reference: reference,
        plate: plate,
        vol: vol, 
        kw: kw, 
        rpm: rpm, 
        amp: amp, 
        diameter: diameter, 
        broad: broad, 
        high: high, 
        long: long, 
        weight: weight, 
        other: other, 
        provider: provider, 
        newProvider: newProvider,
        quotation: quotation, 
        deliverDate: deliverDate, 
        inCharge: getValue.inCharge ? getValue.inCharge : user ? user.name : '',
        bosses: rol==="tech" ? '' : user ? user.name : '',
        numberDeliveryTechnician: numberDeliveryTechnician,
        deliveryTechnician1: deliveryTechnician1,
        deliveryTechnician2: numberDeliveryTechnician === 1 ? '' : deliveryTechnician2,
        deliveryTechnician3: numberDeliveryTechnician === 2 || numberDeliveryTechnician === 1 ? '' : deliveryTechnician3,
        idSearch: getValue.id
    })

    const {editCertificate, errorCertificate: errorEdit, clearErrorCertificate, validatorEditCertificate} = useEditCertificate(() => {
        setOpenEdit(true)
        setLoading(false)
    }, () => setLoading(false), {
        date: getDateTime(), 
        component: component, 
        area: SHEET[user ? user.subrol : ''],
        codigoSAP: codigoSAP,
        machine: machine,
        units: units,
        brand: brand,
        reference: reference,
        plate: plate,
        vol: vol, 
        kw: kw, 
        rpm: rpm, 
        amp: amp, 
        diameter: diameter, 
        broad: broad, 
        high: high, 
        long: long, 
        weight: weight, 
        other: other, 
        provider: provider, 
        newProvider: newProvider,
        quotation: quotation, 
        deliverDate: deliverDate, 
        inCharge: getValue.inCharge ? getValue.inCharge : user ? user.name : '',
        bosses: rol==="tech" ? '' : user ? user.name : '',
        numberDeliveryTechnician: numberDeliveryTechnician,
        deliveryTechnician1: deliveryTechnician1,
        deliveryTechnician2: numberDeliveryTechnician === 1 ? '' : deliveryTechnician2,
        deliveryTechnician3: numberDeliveryTechnician === 2 || numberDeliveryTechnician === 1 ? '' : deliveryTechnician3,
        idSearch: getValue.id
    })

    const reload = () => {
        window.location.reload() //Recarga La Página
    }

    const handleClickPost = () => {   
        if(!validatorPostCertificate()){
            setModalCertificateSend(false)
            return
        }
        postCertificate()     
        setLoading(true)
        setModalCertificateSend(false)
    };

    const handleClickPrint = () => {  
        print(getValue.id)
        setModalCertificate(false)
    };

    const handleClickPut = () => {
        if(!validatorEditCertificate()){
            setModalCertificateAuthorize(false)
            return
        }

        setModalCertificateAuthorize(false)
        setLoading(true)
        editCertificate()
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        clearErrorCertificate()
        clearError()
        setOpen(false)
        setOpenEdit(false)
    }

    const {getPendings, pendings} = useGetPendingsCertificate()

    useEffect(() => {
        if(user){
            getPendings()
        }
        // eslint-disable-next-line
    }, [user])

    //console.log('errorPost', errorPost)

    return(
        <div className="content-departure-certificate">
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={!!errorPost} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%', marginBottom: '10px' }}>
                            <p>{errorPost}</p>
                        </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={1} sx={{ width: '100%' }}>
                <Snackbar open={!!errorEdit} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            <p>{errorEdit}</p>
                        </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openEdit} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Acta de Entrega de Componente No. {getValue.id} Actualizada Con Exito
                        </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Acta de Entrega de Componente No. {lastRow} Creada Con Exito
                        </Alert>
                </Snackbar>
            </Stack>
            <div className="form-departure-certificate">
                <div className="title-form-departure-certificate">
                    Acta de Entrega<br/>de Componente
                    <div className="id-form-departure-certificate">
                        {getValue.id}
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="caption-main-dates">
                    <div className="caption-form-departure-certificate" name="caption-main">
                        Datos Básicos
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="depeartureCertificate">
                    <div className="search-service" name="depeartureCertificate2">
                        <div className="search-carousel" name="depeartureCertificate">
                            <div className="search-service" name="depeartureCertificate">
                            <button className="button-search-service" onClick={getAllCertificates}>
                                <img src="/assets/view/plane.png" alt="plane-paper" />
                            </button>
                            <input className="input-search-service" value={searcher} onChange={(e) => setSearcher(e.target.value)} onKeyDown={handleKeyDown} type="text" placeholder="N° Solicitud" />
                            </div>
                            { 
                                rol==="bosses" ?
                                    <div className="carrousel-pendings" name="depeartureCertificate">
                                        {pendings.length === 0 ? <div className="title-item-pending">Estás al día</div> : <div className="title-item-pending">Pendientes</div>}
                                        {pendings.map((pending) => (
                                            <>
                                                <button onMouseUp={(e) => setSearcher(e.target.value)} onClick={getAllCertificates} value={pending} className="item-pending">
                                                    {pending}
                                                    {/*console.log('pending',pending)*/}
                                                </button>
                                            </>
                                        ))}
                                    </div>
                                : ''
                            }
                        </div>
                    </div>
                    <div className="message-service-not-found">
                        {error && <h4>Servicio no encontrado</h4>}
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="buttons-certificate">
                    {
                        getValue.bosses ? 
                            <>
                             <HtmlTooltip title="Generar PDF" placement="top" arrow>
                                <button className='button-form-departure-certificate' name="button-print" onClick={()=>onModalCertificate()} disabled={loading}>
                                    <img src="/assets/icon/printer.png" alt="printer" />
                                </button>
                                </HtmlTooltip>
                                <HtmlTooltip title="Crear Nueva Acta" placement="top" arrow>
                                <button className='button-form-departure-certificate' name="send-print" onClick={() => reload()} disabled={loading}>
                                    <img src="/assets/getServices/send.png" alt="send" />
                                </button>
                                </HtmlTooltip>
                            </>
                        : getValue.id && rol === "bosses" ?
                            <>
                                <HtmlTooltip title="Autorizar y Modificar" placement="top" arrow>
                                    <button className='button-form-departure-certificate' name="approval-print" onClick={()=>onModalCertificateAuthorize()} disabled={loading}>
                                        <img src="/assets/icon/approval.png" alt="approval" />
                                    </button>
                                </HtmlTooltip>
                                <HtmlTooltip title="Crear Nueva Acta" placement="top" arrow>
                                <button className='button-form-departure-certificate' name="send-print" onClick={() => reload()} disabled={loading}>
                                    <img src="/assets/getServices/send.png" alt="send" />
                                </button>
                                </HtmlTooltip>
                            </>
                        : 
                            <HtmlTooltip title="Crear Nueva Acta" placement="top" arrow>
                                <button className='button-form-departure-certificate' name="send-print" onClick={()=>onModalCertificateSend()} disabled={loading}>
                                    <img src="/assets/getServices/send.png" alt="send" />
                                </button>
                            </HtmlTooltip>
                    } 
                </div>
                <div className="item-form-departure-certificate" name="element">
                    <div className="caption-form-departure-certificate">
                        Nombre Componente 
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setComponent(e.target.value)}
                            value={component}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="brand">    
                    <div className="caption-form-departure-certificate">
                        Codigo SAP 
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setCodigoSAP(e.target.value)}
                            value={codigoSAP}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="date">   
                    <div className="caption-form-departure-certificate">
                        Equipo - Zona de uso del componente
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setMachine(e.target.value)}
                            value={machine}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="reference">
                    <div className="caption-form-departure-certificate">
                        Unidades Enviadas
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setUnits(e.target.value)}
                            value={units}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="sentTo">
                    <div className="caption-form-departure-certificate">
                        Marca
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setBrand(e.target.value)}
                            value={brand}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="caption-main-other">
                    <div className="caption-form-departure-certificate" name="caption-main">
                        Especifiaciones
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="units">
                    <div className="caption-form-departure-certificate">
                        Referencia
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setReference(e.target.value)}
                            value={reference}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="plateDoria">
                    <div className="caption-form-departure-certificate">
                        Placa Equipo
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setPlate(e.target.value)}
                            value={plate}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="plateProvider">
                    <div className="caption-form-departure-certificate">
                        VOL
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setVol(e.target.value)}
                            value={vol}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="quotation">
                    <div className="caption-form-departure-certificate">
                        KW
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setKw(e.target.value)}
                            value={kw}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="VOL">
                    <div className="caption-form-departure-certificate">
                        R.P.M
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setRpm(e.target.value)}
                            value={rpm}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="KW">
                    <div className="caption-form-departure-certificate">
                        AMP
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setAmp(e.target.value)}
                            value={amp}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="RPM">
                    <div className="caption-form-departure-certificate">
                        Diametro
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setDiameter(e.target.value)}
                            value={diameter}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="AMP">
                    <div className="caption-form-departure-certificate">
                        Ancho
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setBroad(e.target.value)}
                            value={broad}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="report">
                    <div className="caption-form-departure-certificate">
                        Alto
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setHigh(e.target.value)}
                            value={high}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate" name="diagnosis">
                    <div className="caption-form-departure-certificate">
                        Largo
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setLong(e.target.value)}
                            value={long}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Peso
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setWeight(e.target.value)}
                            value={weight}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Otras Especifiaciones
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setOther(e.target.value)}
                            value={other}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate"></div>
                <div className="item-form-departure-certificate"></div>
                <div className="item-form-departure-certificate"></div>
                <div className="item-form-departure-certificate" name="caption-main-authorize">
                    <div className="caption-form-departure-certificate" name="caption-main">
                        Autorización de Salida
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Proveedor 
                    </div>
                    <div className="input-form-departure-certificate">
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            sx={{ marginTop: "4px" }}
                            value={provider}
                            options={providers.map((providerItem) => {
                                return {value: providerItem.proveedores, label: providerItem.proveedores}
                            })}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined || value === "" || option.id === value.id
                            }
                            onChange={(e, newValue) => {
                                setProvider(newValue ? newValue.value : '')
                            }}
                        />
                    </div>
                </div>
                {provider === 'OTROS ' ?
                    <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Nuevo Proveedor 
                            </div>
                            <div className="input-form-departure-certificate">
                                <TextField
                                    id="standard-basic" 
                                    variant="standard" 
                                    onChange={(e) => setNewProvider(e.target.value)}
                                    value={newProvider}
                                    multiline
                                />
                            </div>
                    </div>
                : ''}
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Cotización 
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setQuotation(e.target.value)}
                            value={quotation}
                            multiline
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Fecha Entrega 
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            id="standard-basic" 
                            type="date"
                            variant="standard" 
                            onChange={(e) => setDeliverDate(e.target.value)}
                            value={deliverDate}
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    {/* {console.log('getValue.numberDeliveryTechnician',getValue.numberDeliveryTechnician)} */}
                    <div className="caption-form-departure-certificate">
                        # de Técnicos para Entrega 
                    </div>
                    <div className="input-form-departure-certificate">
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            sx={{ marginTop: "4px" }}
                            value={numberDeliveryTechnician}
                            options={[
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' }
                            ]}
                            renderInput={(params) => <TextField {...params} />}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined || value === "" || option.id === value.id
                            }
                            onChange={(e, newValue) => {
                                setNumberDeliveryTechnician(newValue ? newValue.value : '')
                            }}
                        />
                    </div>
                </div>
                {numberDeliveryTechnician === 1 || getValue.numberDeliveryTechnician === '1' ?
                    <div className="item-form-departure-certificate">
                        <div className="caption-form-departure-certificate">
                            Entrega Técnico 1
                        </div>
                        <div className="input-form-departure-certificate">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                sx={{ marginTop: "4px" }}
                                value={deliveryTechnician1 || getValue.deliveryTechnician1}
                                options={technicians.map((techItem) => {
                                    return {value: techItem.técnicos, label: techItem.técnicos}
                                })}
                                renderInput={(params) => <TextField {...params} />}
                                isOptionEqualToValue={(option, value) =>
                                    value === undefined || value === "" || option.id === value.id
                                }
                                onChange={(e, newValue) => {
                                    setDeliveryTechnician1(newValue ? newValue.value : '')
                                }}
                            />
                        </div>
                    </div>
                : numberDeliveryTechnician === 2 || getValue.numberDeliveryTechnician === '2' ? 
                    <>
                        <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Entrega Técnico 1
                            </div>
                            <div className="input-form-departure-certificate">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    sx={{ marginTop: "4px" }}
                                    value={deliveryTechnician1 || getValue.deliveryTechnician1}
                                    options={technicians.map((techItem) => {
                                        return {value: techItem.técnicos, label: techItem.técnicos}
                                    })}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setDeliveryTechnician1(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                        </div>
                        <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Entrega Técnico 2
                            </div>
                            <div className="input-form-departure-certificate">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    sx={{ marginTop: "4px" }}
                                    value={deliveryTechnician2 || getValue.deliveryTechnician2}
                                    options={technicians.map((techItem) => {
                                        return {value: techItem.técnicos, label: techItem.técnicos}
                                    })}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setDeliveryTechnician2(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                        </div>
                    </>
                : getValue.numberDeliveryTechnician === '3' || numberDeliveryTechnician === 3 ? 
                <>
                        <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Entrega Técnico 1
                            </div>
                            <div className="input-form-departure-certificate">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    sx={{ marginTop: "4px" }}
                                    value={deliveryTechnician1 || getValue.deliveryTechnician1}
                                    options={technicians.map((techItem) => {
                                        return {value: techItem.técnicos, label: techItem.técnicos}
                                    })}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setDeliveryTechnician1(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                        </div>
                        <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Entrega Técnico 2
                            </div>
                            <div className="input-form-departure-certificate">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    sx={{ marginTop: "4px" }}
                                    value={deliveryTechnician2 || getValue.deliveryTechnician2}
                                    options={technicians.map((techItem) => {
                                        return {value: techItem.técnicos, label: techItem.técnicos}
                                    })}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setDeliveryTechnician2(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                        </div>
                        <div className="item-form-departure-certificate">
                            <div className="caption-form-departure-certificate">
                                Entrega Técnico 3
                            </div>
                            <div className="input-form-departure-certificate">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    sx={{ marginTop: "4px" }}
                                    value={deliveryTechnician3 || getValue.deliveryTechnician3}
                                    options={technicians.map((techItem) => {
                                        return {value: techItem.técnicos, label: techItem.técnicos}
                                    })}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setDeliveryTechnician3(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                        </div>
                    </> : ''
                }
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Lider a Cargo
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            disabled
                            label={!inCharge && user ? user.name : ''}
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setInCharge(e.target.value)}
                            value={inCharge}
                        />
                    </div>
                </div>
                <div className="item-form-departure-certificate">
                    <div className="caption-form-departure-certificate">
                        Autoriza
                    </div>
                    <div className="input-form-departure-certificate">
                        <TextField
                            disabled
                            id="standard-basic" 
                            variant="standard" 
                            onChange={(e) => setBosses(e.target.value)}
                            value={bosses}
                        />
                    </div>
                </div>
            </div>
            
            <Modal
                open={modalCertificate}
                onClose={onModalCertificate}>
                    {
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
                        <div className='modal-title' name="certificate">
                            <h2><div className="title-img-modal-certificate" name="print"><div className="title-modal-certificate-print">Descargar</div><img src="/assets/icon/printer.png" alt="printer" /></div><br/>Acta De Entrega De Componente</h2>
                        </div>
                        <p className='pModalDelete'>¿Desea descargar el PDF del Acta De Entrega De Componente?</p>
                        <div className='modal-buttons'>
                            <Button color="Primary" onClick={() => handleClickPrint()}>Descargar</Button>
                            <Button onClick={()=>setModalCertificate(false)}>Cancelar</Button>
                        </div>
                    </div></motion.div>}
            </Modal>

            <Modal
                open={modalCertificateAuthorize}
                onClose={onModalCertificateAuthorize}>
                    {
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
                        <div className='modal-title' name="certificate">
                            <h2><div className="title-img-modal-certificate" name="authorize"><div className="title-modal-certificate-authorize">Autorizar y Modificar</div><img src="/assets/icon/approval.png" alt="printer" /></div><br/>Acta De Entrega De Componente</h2>
                        </div>
                        <p className='pModalDelete'>¿Desea Autorizar y Modificar la Acta De Entrega De Componente?</p>
                        <div className='modal-buttons'>
                            <Button color="Primary" onClick={() => handleClickPut()}>Autorizar</Button>
                            <Button onClick={()=>setModalCertificateAuthorize(false)}>Cancelar</Button>
                        </div>
                    </div></motion.div>}
            </Modal>

            <Modal
                open={modalCertificateSend}
                onClose={onModalCertificateSend}>
                    {
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
                        <div className='modal-title' name="certificate">
                            <h2><div className="title-img-modal-certificate" name="send"><div className="title-modal-certificate-send">Enviar</div><img src="/assets/getServices/send.png" alt="printer" /></div><br/>Acta De Entrega De Componente</h2>
                        </div>
                        <p className='pModalDelete'>¿Desea Enviar la Acta De Entrega De Componente para su autorización?</p>
                        <div className='modal-buttons'>
                            <Button color="Primary" onClick={() => handleClickPost()}>Enviar</Button>
                            <Button onClick={()=>setModalCertificateSend(false)}>Cancelar</Button>
                        </div>
                    </div></motion.div>}
            </Modal>
        </div>
    )
}