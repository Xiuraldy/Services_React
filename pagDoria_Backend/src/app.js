const cors = require('cors'); 
const bodyparser = require('body-parser')
const express = require('express');
const { pool } = require('./queries');
const { config } = require('dotenv')
const md5 = require('md5'); 

config();

const app = express();

app.use(cors())
app.use(bodyparser.json())

//Registro
app.post('/api/sign-up', (req, res, next)=>{
    const {name, password, password2, rol, email} = req.body
    if(password != password2){
        return next(new Error('Las constraseñas no coinciden'))
    }
    pool.query(`select count(*) from users where email='${email.toLowerCase()}'`, (error,count)=>{
        if(error){
            return next(error);
        }
        if(count.rows[0].count > 0){
            return next(new Error('El email ya está registrado'))
        }
            pool.query('INSERT INTO users (name, password, rol, email) values ($1, md5($2), $3, $4)', [name, password, rol, email.toLowerCase()], (error,result)=>{
                if(error){
                    return next(error);
                }
                    res.send({name, email: email.toLowerCase(), rol});
                    // console.log('req.body --->', req.body)
            })
    })
})


//Inicio de Sesión
app.post('/api/login', (req, res, next)=>{
    const {password, email} = req.body
    pool.query(`SELECT * FROM users WHERE email='${email.toLowerCase()}'`, (error,user)=>{
        if(error){
            return next(error);
        }
        if(!user.rows.length){
            return next(new Error('Credenciales incorrectas'))
        }
        const userFind = user.rows[0]
        if(userFind.password !== md5(password)){
            return next(new Error('Credenciales incorrectas'))
        }
        res.send({
            name: userFind.name,
            email: userFind.email,
            rol: userFind.rol
        })
    })
})

//Consultar Usuarios
app.get('/api/users', (req, res, next)=>{
    // console.log('req -->', req.query)
    const search = req.query.search ? `WHERE (name ilike '%${req.query.search[0]}%' or email ilike '%${req.query.search[0]}%') and rol ilike '%${req.query.search[1]}%'` : '';
    // console.log('search --> ', search)
    pool.query(`SELECT * FROM users ${search} order by id DESC limit 9 offset ${(req.query.pag-1)*9}`, (error, result) => {
        if(error){
            console.log('error data -->', error)
            return next(error);
        }
        pool.query(`SELECT COUNT(*) FROM users ${search}`, (errorCount, resultCount) => {
            if(errorCount){
                console.log('error count -->', error)
                return next(errorCount);
            }
            res.send({data: result.rows, count: resultCount.rows[0].count})
        })
    })
})

//Eliminar Usuarios
app.delete('/api/users/:id', (req, res)=>{
    pool.query('DELETE FROM users WHERE id='+req.params.id+' RETURNING *', (error,result)=>{
        if(error){
            throw error;
        }else{
            res.send(result.rows[0])
        }
    })
})

//Actualizar Usuarios
app.put('/api/users/:id', (req, res)=>{
    const {name, rol, email} = req.body;
    // console.log(req.params.id, name, rol, email);
    pool.query('UPDATE users SET rol =\''+rol+'\', name =\''+name+'\', email =\''+email+'\' WHERE id ='+req.params.id, (error,result)=>{
        if(error){
            throw error;
        }else{
            res.send({message: 'Actualizado'});
        }
    })
})

//Error 500
app.use(function(err, req, res, next) {
    console.log('Entro a error 500');
    res.status(500).send({
        error: err.message 
    })
});

//Puerto
const puerto = process.env.PORT || 3000;

app.listen(puerto, function(){
    console.log("Servidor OK EN PUERTO:"+puerto);
});