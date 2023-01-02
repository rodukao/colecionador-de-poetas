const bcrypt = require("bcryptjs");
const connection = require("./db");

//REGISTER
exports.register = (req, res) => {

    const { nome, email, senha } = req.body
    console.log(nome, email, senha);

    if(nome && email && senha){
        connection.getConnection(function(err, poolConnection) {
            if(err) console.log('Connection error: ', err);
            else{
                poolConnection.query("SELECT email FROM usuarios WHERE email = ?", [email], async (error, result) => {
                    if(error){
                        console.log(error)
                    }
            
                    if(result.length > 0){
                        return res.render('cadastro', {
                            message: "Email já registrado. Por favor use um email diferente."
                        })
                    }
            
                    else {
                        let senhaCriptografada = await bcrypt.hash(senha, 8)
                        connection.query(`INSERT INTO usuarios (nome, email, senha) values ('${nome}', '${email}', '${senhaCriptografada}')`, (error, result) => {
                            if(error) throw error        
                        })
                            return res.render('login', {
                                message: "Usuário cadastrado com sucesso."
                            });
                    }   
                })
                poolConnection.release()
            }
        })
    } else {
        console.log('Dados não preenchidos')
        res.render('cadastro', {
            message: "Todos os campos precisam ser preenchidos."
        });
    }
}

//LOGIN
exports.login = (req, res) => {

    const { email, senha } = req.body
    connection.getConnection(async function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{
            let sessionpw = await bcrypt.hash(Math.random().toString(36).slice(-8), 8)
            poolConnection.query(`UPDATE usuarios SET sessionpw = '${sessionpw}' WHERE email = '${email}'`, async (error, result) => {
                if(error) throw error
                else {
                    poolConnection.query(`SELECT id, email, senha, sessionpw FROM usuarios WHERE email = '${email}'`, async (error, result) => {
                        if(error) throw error
                        
                        if(result.length == 0) {
                            return res.render('login', {
                                message: "Email não encontrado"
                            })
                        } else {
                            const compare = await bcrypt.compare(senha, result[0].senha);
                            if(compare){
                                res.cookie('userID', result[0].id, {path: '/'}, {maxAge: 10800})
                                res.cookie('userps', sessionpw, {path: '/'}, {maxAge: 10800})
                                return res.redirect('../');
                            } else {
                                return res.render('login', {
                                    message: "Senha incorreta"
                                })
                            }
                        }
                    })
                }
            })   
            poolConnection.release()
        }
    })
}