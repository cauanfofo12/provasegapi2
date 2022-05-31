import {inserirFilme} from "../repository/filmeRepository.js"


import { Router } from "express"

const server = Router();

server.post('/filme', async (req, resp) =>{
    try{
        const filmesnovos =req.body;

        const filmeins = await inserirFilme(filmesnovos);


        resp.send(filmeins)

    }

    catch (err){
        resp.send(400).send({
            erro: err.message
        })
    }
})


export default server;

