import {inserirFilme, inserirImagem, ListarTodosFilmes, removerFilme} from "../repository/filmeRepository.js"
import multer from 'multer'

import { Router } from "express"



const server = Router();
const upload = multer({ dest: 'storage/capasfilmes'})

server.post('/filme', async (req, resp) =>{
    try{
        const filmesnovos =req.body;

        if(!filmesnovos.nome){
            throw new Error('nome do filme é obrigatorio')
        }
        if(!filmesnovos.sinopse){
            throw new Error('sinopse do filme é obrigatorio')
        }
        if(!filmesnovos.avaliacao){
            throw new Error('avaliação do filme é obrigatorio')
        }
        if(!filmesnovos.lancamento){
            throw new Error('lançamento do filme é obrigatorio')
        }
        if(!filmesnovos.disponivel){
            throw new Error('campo disponivel é obrigatorio')
        }
        if(!filmesnovos.usuario){
            throw new Error('usuario não logado')
        }

        const filmeins = await inserirFilme(filmesnovos);


        resp.send(filmeins)

    }

    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})



server.put('/filme/:id/capa',upload.single('capa') ,async (req, resp)=>{
    try{

        const { id } = req.params;
        const imagem = req.file.path;
        const resposta = await inserirImagem(imagem, id)
        if(resposta != 1){
            throw new Error('A imagem não pode ser salva')
        }

        resposta.status(202).send();

    }
    catch(err){
        resp.status(400).send({
            erro:err.message
        })
        }
    })

server.get('/filme', async (req, resp) =>{
    try{
        const resposta= Number(req.params.resposta);
        resp.send(resposta);
    }
    catch (err){
        resp.status(400).send({
        erro:err.message   
        })
    }
})

server.delete('/filme', async (req, resp) =>{
    try{
        const [id] = req.params;

        const resposta = await removerFilme(id)
        if(resposta != 1){
            throw new Error('filme não pode ser removido')
        }
    }
    catch (err){
        resp.status(400).send({
            erro:err.message  
    })
}
})


export default server;

