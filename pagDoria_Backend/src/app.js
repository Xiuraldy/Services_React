//Enlaces para conectar con las Funciones del Frontend (Peticiones a Base de Datos y Hoja de Calculo)

const cors = require('cors');
const bodyparser = require('body-parser')
const express = require('express');
const { pool } = require('./queries');
const { config } = require('dotenv')
const md5 = require('md5');
const { arrayToJson } = require('./parser');
const { csvJSON } = require('./csvtojson');
const { HOJAS_BY_GID, HOJAS_BY_TYPE } = require('./constants');
const { getAccessToken } = require('./spreadsheet');

config();

const app = express();
app.use(bodyparser.json())
app.use(cors())

//token -> Es una clave que se genera para tener acceso a la Hoja de Calculo
//query -> Consultas a la base de datos
//app."metodo de llamado" -> Post: Subir Datos / Get: Traer Datos / Put: Modificar Datos
//Url con values que empiezan con ":" están trayendo datos del Frontend

//--- Ingreso ---
//Registro
app.post('/api/sign-up', (req, res, next) => {
    const { name, password, password2, rol, subrol, email } = req.body
    if (password != password2) {
        return next(new Error('Las constraseñas no coinciden'))
    }
    pool.query(`select count(*) from users where email='${email.toLowerCase()}'`, (error, count) => {
        if (error) {
            return next(error);
        }
        if (count.rows[0].count > 0) {
            return next(new Error('El email ya está registrado'))
        }
        pool.query('INSERT INTO users (name, password, rol, subrol, email) values ($1, md5($2), $3, $4, $5)', [name, password, rol, subrol, email.toLowerCase()], (error, result) => {
            if (error) {
                return next(error);
            }
            res.send({ name, email: email.toLowerCase(), rol, subrol });
            // console.log('req.body --->', req.body)
        })
    })
})


//Inicio de Sesión
app.post('/api/login', (req, res, next) => {
    const { password, email } = req.body
    pool.query(`SELECT * FROM users WHERE email='${email.toLowerCase()}'`, (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user.rows.length) {
            return next(new Error('Credenciales incorrectas'))
        }
        const userFind = user.rows[0]
        if (userFind.password !== md5(password)) {
            return next(new Error('Credenciales incorrectas'))
        }
        res.send({
            name: userFind.name,
            email: userFind.email,
            rol: userFind.rol,
            subrol: userFind.subrol
        })
    })
})

//--- CRUD Usuarios ---
//Consultar Usuarios
app.get('/api/users', (req, res, next) => {
    // console.log('req -->', req.query)
    const search = req.query.search ? `WHERE (name ilike '%${req.query.search[0]}%' or email ilike '%${req.query.search[0]}%') and rol ilike '%${req.query.search[1]}%'` : '';
    // console.log('search --> ', search)
    pool.query(`SELECT * FROM users ${search} order by id DESC limit 9 offset ${(req.query.pag - 1) * 9}`, (error, result) => {
        if (error) {
            console.log('error data -->', error)
            return next(error);
        }
        pool.query(`SELECT COUNT(*) FROM users ${search}`, (errorCount, resultCount) => {
            if (errorCount) {
                console.log('error count -->', error)
                return next(errorCount);
            }
            res.send({ data: result.rows, count: resultCount.rows[0].count })
        })
    })
})

//Eliminar Usuarios
app.delete('/api/users/:id', (req, res) => {
    pool.query('DELETE FROM users WHERE id=' + req.params.id + ' RETURNING *', (error, result) => {
        if (error) {
            throw error;
        } else {
            res.send(result.rows[0])
        }
    })
})

//Actualizar Usuarios
app.put('/api/users/:id', (req, res) => {
    const { name, rol, subrol, email } = req.body;
    pool.query('UPDATE users SET rol =\'' + rol + '\', subrol =\'' + subrol + '\', name =\'' + name + '\', email =\'' + email + '\' WHERE id =' + req.params.id, (error, result) => {
        if (error) {
            throw error;
        } else {
            res.send({ message: 'Actualizado' });
        }
    })
})

//--- API ---
//Visualizar datos (SERVICIOS)
app.get("/api/sheet/:sheet/services", async (req, res, next) => {
    const sheet = HOJAS_BY_TYPE[req.params.sheet]
    fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/values/${sheet}!A1:AD10?access_token=` + process.env.GOOGLE_API + "&key=" + process.env.GOOGLE_API)
        .then((lista) => {
            return lista.json()
        }).then((valores) => {
            const data = arrayToJson(valores.values, ['id','FechaSolicitud','Proovedor','SolicitudProveedor','NúmeroAcreedor','NombreCotización','PDFCotización','COP','USD','EUR','DescripciónServicio','ImputaciónSolicita','Solicita','FechaAprobación','CoordinadorAutoriza','Prioridad','ImputaciónAutoriza','ObservacionesAutoriza','FechaGeneraciónOrden','Solped','OrdenCompra','Estado','PDFOrdenCompra','FacturaciónServicio','FechaFacturación','ObservacionesConfiabilidad','estadoServicio','ejecuciónServicio','númeroActa','ultimoId'])
            res.send(data)
        }).catch(err => {
            return next(err)
        })
})

//Manejo de API (Ingresar datos a Google Sheets)
app.post('/api/add/:sheet/services', async (req, res, next) => {
    const sheet = HOJAS_BY_TYPE[req.params.sheet]
    const { id, fechaSolicitud, proovedor, solicitudProveedor, numeroAcreedor, nombreCotizacion, PDFCotizacion, COP, USD, EUR, descripcionServicio, imputacionSolicita, solicita, fechaAprobacion, coordinadorAutoriza, prioridad, imputacionAutoriza, observacionesAutoriza, fechaGeneracionOrden, solped, ordenCompra, estado, PDFOrdenCompra, facturacionServicio, fechaFacturacion, observacionesConfiabilidad, estadoServicio, ejecuciónServicio, númeroActa } = req.body
    const token = await getAccessToken()
    // console.log('req -->', req)
    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "values": [
                [
                    id,
                    fechaSolicitud,
                    proovedor,
                    solicitudProveedor,
                    numeroAcreedor,
                    nombreCotizacion,
                    PDFCotizacion,
                    COP ? parseInt(COP) : null,
                    USD ? parseInt(USD) : null,
                    EUR ? parseInt(EUR) : null,
                    descripcionServicio,
                    imputacionSolicita,
                    solicita,
                    fechaAprobacion,
                    coordinadorAutoriza,
                    prioridad,
                    imputacionAutoriza,
                    observacionesAutoriza,
                    fechaGeneracionOrden,
                    solped,
                    ordenCompra,
                    estado,
                    PDFOrdenCompra,
                    facturacionServicio,
                    fechaFacturacion,
                    observacionesConfiabilidad,
                    estadoServicio,
                    ejecuciónServicio,
                    númeroActa
                ]
            ]
        })
    }
    // console.log('requestOptions -->', requestOptions)
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/values/${sheet}!A1:AD13:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`, requestOptions).then((lista) => {
        return lista.json()
    }).then((response) => {
        res.send(response)
    }).catch(err => {
        console.log('catch -->', err)
        return next(err)
    })
})

//Ingresar datos a ACTA de Salida
app.post('/api/add/certificate/:sheet/services', async (req, res, next) => {
    const { id, date, component, area, codigoSAP, machine, units, brand, reference, plate, vol, kw, rpm, amp, diameter, broad, high, long, weight, other, provider, newProvider, quotation, deliverDate, inCharge, bosses, numberDeliveryTechnician, deliveryTechnician1, deliveryTechnician2, deliveryTechnician3 } = req.body
    const token = await getAccessToken()
    // console.log('req -->', req)
    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "values": [
                [
                    id, 
                    date, 
                    component, 
                    area,  
                    codigoSAP, 
                    machine,
                    units,
                    brand, 
                    reference, 
                    plate, 
                    vol, 
                    kw, 
                    rpm, 
                    amp, 
                    diameter, 
                    broad, 
                    high, 
                    long, 
                    weight, 
                    other, 
                    provider, 
                    newProvider,
                    quotation, 
                    deliverDate, 
                    inCharge,
                    bosses,
                    numberDeliveryTechnician,
                    deliveryTechnician1,
                    deliveryTechnician2,
                    deliveryTechnician3
                ]
            ]
        })
    }
    // console.log('req.body -->', req.body)
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/values/Actas Salida!A1:AD13:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`, requestOptions).then((lista) => {
        return lista.json()
    }).then((response) => {
        res.send(response)
    }).catch(err => {
        console.log('catch -->', err)
        return next(err)
    })
})

//Manejo de API (Actualizar datos a Google Sheets)
app.put('/api/edit/:sheet/services/:value', async (req, res, next) => {
    const sheet = HOJAS_BY_TYPE[req.params.sheet]
    const { id, fechaSolicitud, proovedor, solicitudProveedor, numeroAcreedor, nombreCotizacion, PDFCotizacion, COP, USD, EUR, descripcionServicio, imputacionSolicita, solicita, fechaAprobacion, coordinadorAutoriza, prioridad, imputacionAutoriza, observacionesAutoriza, fechaGeneracionOrden, solped, ordenCompra, estado, PDFOrdenCompra, facturacionServicio, fechaFacturacion, observacionesConfiabilidad, estadoServicio, ejecuciónServicio, númeroActa } = req.body
    const token = await getAccessToken()
    const requestOptions = {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "values": [
                [
                    id,
                    fechaSolicitud,
                    proovedor,
                    solicitudProveedor,
                    numeroAcreedor,
                    nombreCotizacion,
                    PDFCotizacion,
                    COP ? parseInt(COP) : '',
                    USD ? parseInt(USD) : '',
                    EUR ? parseInt(EUR) : '',
                    descripcionServicio,
                    imputacionSolicita,
                    solicita,
                    fechaAprobacion,
                    coordinadorAutoriza,
                    prioridad,
                    imputacionAutoriza,
                    observacionesAutoriza,
                    fechaGeneracionOrden,
                    solped,
                    ordenCompra,
                    estado,
                    PDFOrdenCompra,
                    facturacionServicio,
                    fechaFacturacion,
                    observacionesConfiabilidad,
                    estadoServicio,
                    ejecuciónServicio,
                    númeroActa
                ]
            ]
        })
    }

    //Busca el número de celda
    const codeString = req.params.value;
    const codeReplace = codeString.replace(/['"]+/g, '')
    const codeNumber = parseInt(codeReplace)
    const code = codeNumber+1
    
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/values/${sheet}!A${code}:AD${code}?valueInputOption=RAW`, requestOptions).then((lista) => {
        return lista.json()
    }).then((response) => {
        res.send(response)
    }).catch(err => {
        console.log('catch -->', err)
        return next(err)
    })
})

//Modificar Y Autorizar (ACTA)
app.put('/api/edit/certificate/:value', async (req, res, next) => {
    const { id, date, component, area, codigoSAP, machine, units, brand, reference, plate, vol, kw, rpm, amp, diameter, broad, high, long, weight, other, provider, newProvider, quotation, deliverDate, inCharge, bosses, numberDeliveryTechnician, deliveryTechnician1, deliveryTechnician2, deliveryTechnician3 } = req.body
    // console.log('req.params.value',req.params.value)
    const token = await getAccessToken()
    const requestOptions = {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "values": [
                [
                    id, 
                    date, 
                    component, 
                    area,  
                    codigoSAP, 
                    machine,
                    units,
                    brand, 
                    reference, 
                    plate, 
                    vol, 
                    kw, 
                    rpm, 
                    amp, 
                    diameter, 
                    broad, 
                    high, 
                    long, 
                    weight, 
                    other, 
                    provider, 
                    newProvider,
                    quotation, 
                    deliverDate, 
                    inCharge,
                    bosses,
                    numberDeliveryTechnician,
                    deliveryTechnician1,
                    deliveryTechnician2,
                    deliveryTechnician3
                ]
            ]
        })
    }

    //Busca el número de celda
    const codeString = req.params.value;
    const codeReplace = codeString.replace(/['"]+/g, '')
    const codeNumber = parseInt(codeReplace)
    const code = codeNumber+1
    
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/values/Actas Salida!A${code}:AD${code}?valueInputOption=RAW`, requestOptions).then((lista) => {
        return lista.json()
    }).then((response) => {
        // console.log('response',response)
        res.send(response)
    }).catch(err => {
        console.log('catch -->', err)
        return next(err)
    })
})

//Buscador (ACTA)
app.get("/api/certificate/:area/search/:search", (req, res) => {
    const area = HOJAS_BY_TYPE[req.params.area]
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    // console.log('req.params.area', area)

    //Busca el número de celda
    const codeString = req.params.search;
    const codeReplace = codeString.replace(/['"]+/g, '')
    const codeNumber = parseInt(codeReplace)
    const code = codeNumber+1

    const query = `select * where (A = ${req.params.search}) and (D = '${area}')`
    //console.log('URL', `https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=958187826&tqx=out:csv&range=A2:AD&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
    fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=958187826&tqx=out:csv&range=A${code}:AD${code}&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log('result',result)
            if (!result) {
                return res.send([])
            }

            // console.log(' result ...', result.length)
            const headCSV = '"id","date","component","area","codigoSAP","machine","units","brand","reference","plate","vol","kw","rpm","amp","diameter","broad","high","long","weight","other","provider","newProvider","quotation","deliverDate","inCharge","bosses","numberDeliveryTechnician","deliveryTechnician1","deliveryTechnician2","deliveryTechnician3"\n'
            const dataJSON = csvJSON(headCSV + result)
            // console.log('data json...', dataJSON)
            // console.log('dataJSON',dataJSON)
            res.send(dataJSON)
        })
        .catch(error => console.log('error', error));
})

//Buscador
app.get("/api/sheet/:sheet/services/search/:value", (req, res) => {
    const sheet = HOJAS_BY_GID[req.params.sheet]
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const query = `select * where A = ${req.params.value}`
    // console.log('URL', `https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:Z&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
    fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:AD&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log('result',result)
            if (!result) {
                return res.send([])
            }

            // console.log(' result ...', result.length)
            const headCSV = '"id","FechaSolicitud","Proovedor","SolicitudProveedor","NúmeroAcreedor","NombreCotización","PDFCotización","COP","USD","EUR","DescripciónServicio","ImputaciónSolicita","Solicita","FechaAprobación","CoordinadorAutoriza","Prioridad","ImputaciónAutoriza","ObservacionesAutoriza","FechaGeneraciónOrden","Solped","OrdenCompra","Estado","PDFOrdenCompra","FacturaciónServicio","FechaFacturación","ObservacionesConfiabilidad","estadoServicio","ejecuciónServicio","númeroActa"\n'
            const dataJSON = csvJSON(headCSV + result)
            // console.log('data json...', dataJSON)
            // console.log('dataJSON',dataJSON)
            res.send(dataJSON)
        })
        .catch(error => console.log('error', error));
})

//Trae Pendientes (Autorización/Ruta:authorize)
app.get("/api/sheet/:sheet/pendings", (req, res) => {
    const sheet = HOJAS_BY_GID[req.params.sheet]
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const query = `select * where O = ""`
    // console.log('URL', `https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:Z&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
    fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:O&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (!result) {
                return res.send([])
            }

            // console.log(' result ...', result.length)
            const headCSV = '"id","FechaSolicitud","Proovedor","SolicitudProveedor","NúmeroAcreedor","NombreCotización","PDFCotización","COP","USD","EUR","DescripciónServicio","ImputaciónSolicita","Solicita","FechaAprobación","CoordinadorAutoriza"\n'
            const dataJSON = csvJSON(headCSV + result)
            // console.log('dataJSON',dataJSON)
            // console.log('result',result)

            //Trae lista de los id para reconocer cuales están sin "Coordinador que autoriza"
            const listIdsPendings = []
            for(let i=0; i<dataJSON.length; i++){
                const ids = dataJSON[i].id
                listIdsPendings.push(ids)
            }

            // console.log('listIdsPendings',listIdsPendings)
            
            res.send(listIdsPendings)
            // console.log('data json...', dataJSON)
        })
        .catch(error => console.log('error', error));
})

//Trae Pendientes (Visualizar - Ruta:view)
app.get("/api/sheet/:sheet/pendings/view", (req, res) => {
    const sheet = HOJAS_BY_GID[req.params.sheet]
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const query = `select * where X = "Sin facturar"`
    // console.log('URL', `https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:Z&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
    fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:X&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (!result) {
                return res.send([])
            }

            // console.log(' result ...', result.length)
            const headCSV = '"id","FechaSolicitud","Proovedor","SolicitudProveedor","NúmeroAcreedor","NombreCotización","PDFCotización","COP","USD","EUR","DescripciónServicio","ImputaciónSolicita","Solicita","FechaAprobación","CoordinadorAutoriza", "Prioridad","ImputaciónAutoriza","ObservacionesAutoriza","FechaGeneraciónOrden","Solped","OrdenCompra","Estado","PDFOrdenCompra","FacturaciónServicio"\n'
            const dataJSON = csvJSON(headCSV + result)
            // console.log('dataJSON',dataJSON)
            // console.log('result',result)

            //Trae lista de los id para reconocer cuales están sin "Sin facturar"
            const listIdsPendings = []
            for(let i=0; i<dataJSON.length; i++){
                const ids = dataJSON[i].id
                listIdsPendings.push(ids)
            }
            
            // console.log('listIdsPendings',listIdsPendings)
            res.send(listIdsPendings)
            // console.log('data json...', dataJSON)
        })
        .catch(error => console.log('error', error));
})

//Trae Pendientes (ACTA/Ruta:departure-certificate)
app.get("/api/pendings/certificate", (req, res) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    //Consulta
    const query = `select * where Z = ""`
    // console.log('URL', `https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&range=A2:Z&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
    fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=958187826&tqx=out:csv&range=A2:Z&tq=` + query + `&access_token=` + process.env.GOOGLE_API, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (!result) {
                return res.send([])
            }

            // console.log(' result ...', result.length)
            const headCSV = '"id","date","component","area","codigoSAP","machine","units","brand","reference","plate","vol","kw","rpm","amp","diameter","broad","high","long","weight","other","provider","newProvider","quotation","deliverDate","inCharge","bosses","numberDeliveryTechnician","deliveryTechnician1","deliveryTechnician2","deliveryTechnician3"\n'
            const dataJSON = csvJSON(headCSV + result)
            // console.log('dataJSON',dataJSON)
            // console.log('result',result)

            //Trae lista de los id para reconocer cuales están sin "Autoriza Doria"
            const listIdsPendings = []
            for(let i=0; i<dataJSON.length; i++){
                const ids = dataJSON[i].id
                listIdsPendings.push(ids)
            }
            
            res.send(listIdsPendings)
            // console.log('data json...', dataJSON)
        })
        .catch(error => console.log('error', error));
})

//LastRow (Trae el ultimo servicio creado que se ubica en la celda del rango)
app.get("/api/lastrow/sheet/:sheet/services", async (req, res) => {
    const sheet = HOJAS_BY_GID[req.params.sheet]
    var requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        redirect: 'follow'
      };
      
      fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=${sheet}&tqx=out:csv&access_token=${process.env.GOOGLE_API}&range=AD2`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return res.send({result})
        })
        .catch(error => console.log('error', error));
})

//LastRowCertificate (Trae el ultimo servicio creado que se ubica en la celda del rango)
app.get("/api/lastrow/certificate/sheet/services", async (req, res) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        redirect: 'follow'
      };
      
      fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=958187826&tqx=out:csv&access_token=${process.env.GOOGLE_API}&range=AE2`, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log('result',result)
            return res.send({result})
        })
        .catch(error => console.log('error', error));
})

//Providers (Trae proveedores)
app.get("/api/providers/sheet/services", async (req, res) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        redirect: 'follow'
      };
      
      fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=1443500581&tqx=out:csv&access_token=${process.env.GOOGLE_API}&range=D2:D`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return res.send(csvJSON('"proveedores"\n' + result))
        })
        .catch(error => console.log('error', error));
})

//Technicians 
app.get("/api/technicians/sheet/services", async (req, res) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        redirect: 'follow'
      };
      
      fetch(`https://docs.google.com/spreadsheets/d/1f0TG7ebAVJnjx2G1W30KPstG6t9OgK896kjZF7pR0ZI/gviz/tq?gid=237516242&tqx=out:csv&access_token=${process.env.GOOGLE_API}&range=A2:A`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return res.send(csvJSON('"técnicos"\n' + result))
        })
        .catch(error => console.log('error', error));
})

//Error 500
app.use(function (err, req, res, next) {
    console.log('Entro a error 500');
    res.status(500).send({
        error: err.message
    })
});

//Puerto
const puerto = process.env.PORT || 3000;
// console.log('puerto -->', puerto)

app.listen(puerto, function () {
    console.log("Servidor OK EN PUERTO:" + puerto);
});