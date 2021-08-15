const { query } = require('express');
const express = require('express');
const app = express();
const mariadb=require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost', 
    user: process.env.MARIADB_USER, 
    password: process.env.MARIADB_PASSWORD,
    database: "scontrini"
});


const port= process.env.PORT || 3000;

const get_tipologie="SELECT * FROM tipologia";
const insert_tipo="INSERT INTO tipologia(tipo) VALUES (?)";
const delete_tipo="DELETE FROM tipologia WHERE tipo=?";

const get_scontrini="SELECT * FROM scontr WHERE YEAR(data)=?";
const get_scontrini_by_month=get_scontrini+" AND MONTH(data)=?";
const get_scontrini_by_month_and_type=get_scontrini_by_month+" AND tipo=?";
const get_scontrini_by_date="SELECT * FROM scontr WHERE data=?";
const get_scontrini_by_week="SELECT * FROM scontr WHERE WEEK(data)=WEEK(?)"
const add_scontrino="INSERT INTO scontr(tipo, data, prezzo, descrizione) VALUES (?, ?, ?, ?)";
const delete_scontrino="DELETE FROM scontr WHERE tipo=? AND data=? AND prezzo=?";

const checker_no_digits= new RegExp("\\d+");
const checker_format= new RegExp("[A-Z]{1}[a-z]+");

function checkFormat(stringa){
    if(stringa.match(checker_no_digits) != null)throw "Contenete numeri, errore!";
    if(stringa.match(checker_format) != stringa)throw "Formato errato!";
}

pool.getConnection()
    .then(conn => {

//SEZIONE TIPOLOGIA

        //ritorna tutte le tipologie
        app.get('/api/getTipologie', function (req, res) {
            conn.query(get_tipologie)
            .then((result)=>{
                res.send(result);
            })
            .catch((err)=>{
                res.send("errore");
            })
        });

        /*axios.put('/api/addTipologia/TipologiaNuova')*/
        //dovrà essere app.put
        //aggiunta nuova tipologia
        app.get('/api/addTipologia', function (req, res){
            //let tipo=req.body.tipo;
            let tipo=req.query.tipo;
            try{
                checkFormat(tipo);
                conn.query(insert_tipo,(tipo))
                .then((result)=>{
                        res.send(`${tipo} aggiunto al db`);
                    }
                );
            }catch (e){
                res.send(e.toString());
            }
        });

        //questo dovrà diventare app.delete
        //elimina una tipologia
        app.get('/api/deleteTipologia', function (req, res){
            let tipo=req.query.tipo;
            try{
                checkFormat(tipo);
                conn.query(delete_tipo,(tipo)).
                then((result)=>{
                        res.send(`${tipo} rimosso dal db`);
                    }
                )
                .catch((err)=>{
                    res.send("errore rimozione tipo");
                });
            }catch (e){
                res.send(e.toString());
            }
        });

//SEZIONE SCONTRINI


        //aggiunto nuovo scontrino
        app.post('/api/addScontrino', function (req, res){
            let tipo=req.body.tipo;
            let data=req.body.data;
            let prezzo=req.body.tipo;
            let descrizione=req.body.descrizione;
            conn.query(add_scontrino,(tipo, data, prezzo, descrizione))
                .then((result)=>{
                    res.send(`Aggiunto nuovo scontrino`);
                })
                .catch((err)=>{
                    res.send(err);
                });
        });

        //elimino scontrino
        //dovrà essere .delete
        app.post('/api/deleteScontrino', function (req, res){
            let tipo=req.body.tipo;
            let data=req.body.data;
            let prezzo=req.body.tipo;
            conn.query(delete_scontrino,(tipo, data, prezzo))
                .then((result)=>{
                    res.send(`Scontrino eliminato`);
                })
                .catch((err)=>{
                    res.send(err);
                });
        });

        //ritorna tutti gli scontrini in un anno
        app.get('/api/getScontrini', function (req, res) {
            let year=req.query.year;
            conn.query(get_scontrini,(year))
            .then((result)=>{
                res.send(result);
            })
            .catch((err)=>{
                res.send(err);
            })
        });

        //ritorna tutti gli scontrini in un anno e mese
        app.get("/api/getScontriniByMonth", function (req, res) {
            let year= req.query.year;
            let month= req.query.month;
            conn.query(get_scontrini_by_month,(year, month))
            .then((result)=>{
                res.send(result);
            })
            .catch((err)=>{
                res.send(err);
            })
        })

        //applicazione setuppata e ora la lancio
        app.listen(port);
        
    }).catch(err => {
      //not connected
        console.log("errore connessione db")
    });


