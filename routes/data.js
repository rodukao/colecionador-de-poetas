const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")
const functions = require("../controllers/functions")

router.get('/user-info', (req, res) => {
    const cookies = functions.RetornaCookies(req);
    if(cookies){
        connection.getConnection(function(err, poolConnection){
            if(err) console.log(err);
            else {
                poolConnection.query(`SELECT id, sessionpw, nome FROM usuarios WHERE id = '${cookies.UserID}';`, (error, result) => {
                    if(error) throw error;
                    else {
                        if(result.length > 0){
                            let userDataCards = [];
                            if(result[0].sessionpw == cookies.UserPW){

                                const userInfo = result[0];
                                userDataCards.push(userInfo);

                                poolConnection.query(`SELECT
                                    cartas.id AS 'idCarta', 
                                    cartas.nome_poeta AS 'nomeCarta' 
                                    FROM relacao_cartas_usuarios 
                                    INNER JOIN cartas on cartas.id = relacao_cartas_usuarios.idCartas 
                                    WHERE idUsuarios = ${userInfo.id}
                                    ORDER BY cartas.id;`, (error, result) => {
                                    if(error) throw error;
                                    else {
                                        let cartas = []
                                        if(result.length > 0){
                                            result.map(item => {
                                                cartas.push(item)
                                            })
                                        }
                                        userDataCards.push(cartas);
                                        res.send(userDataCards);
                                    }
                                })
                                

                            } else {
                                res.send({Credenciais: "Inválidas"})
                            }
                        } else {
                            res.send({Credenciais: "Inválidas"})
                        }
                    }
                })
            }
        })
    }
})

router.get('/carta', (req, res) => {
    const cookies = functions.RetornaCookies(req);
    if(cookies){
        const cartaSorteada = Math.floor(Math.random() * 8 + 1);
        connection.getConnection(function(err, poolConnection){
            if(err) console.log(err);
            else {
                poolConnection.query(`SELECT idCartas FROM relacao_cartas_usuarios WHERE idUsuarios = '${cookies.UserID}';`, (error, result) => {
                    let cartasAdquiridas = [];
                    for(let i = 0; i < result.length; i++){
                        cartasAdquiridas.push(result[i].idCartas);
                    }
                    console.log(cartasAdquiridas, cartaSorteada);
                    console.log(cartasAdquiridas.includes(cartaSorteada));

                    if(cartasAdquiridas.includes(cartaSorteada)){
                        res.send({Resp: "Você já obtém essa carta."})
                    } else {
                        poolConnection.query(`INSERT INTO relacao_cartas_usuarios (idUsuarios, idCartas) VALUES ('${cookies.UserID}', '${cartaSorteada}');`, (error, result) => {
                            if(err) console.log(err);
                            else{
                                console.log(result)
                                res.send({Resp: "Você adquiriu uma carta nova."})
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.send({Credenciais: "Inválidas"})
    }
})

router.get('/hora', (req, res) => {
    const cookies = functions.RetornaCookies(req);
    connection.getConnection(function(err, poolConnection){
        if(err) console.log(err);
        poolConnection.query(`SELECT id, hora FROM usuarios WHERE id = '${cookies.UserID}';`, (error, result) => {
            if(error) throw error;
            else {
                let lastClickTime = parseDate(result[0].hora);
                let currentTime = new Date();
                console.log(currentTime, lastClickTime, currentTime - lastClickTime);

                if (lastClickTime === null || currentTime - lastClickTime > 24 * 60 * 60 * 1000) {
                    lastClickTime = currentTime;
                    let mysqlDate = lastClickTime.toISOString().slice(0, 19).replace('T', ' ');
                    poolConnection.query(`UPDATE usuarios SET hora = '${mysqlDate}' WHERE id = '${cookies.UserID}';`, (error, result) => {
                        if(error) throw error;
                        else {
                            console.log("Registro atualizado com sucesso")
                        }
                    })
                } else {
                        console.log("Ainda não passou 24h")
                }
            }
        })
    })    
})

function parseDate(input) {
    let parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]);
  }

module.exports = router;