import {alterarFilme, buscarPorNome, inserirFilme, inserirImagem, ListarTodosFilmes, removerFilme} from "../repository/filmeRepository.js"
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
        if(!filmesnovos.avaliacao == undefined || filmesnovos.avaliacao < 0){
            throw new Error('avaliação do filme é obrigatorio')
        }
        if(!filmesnovos.lancamento){
            throw new Error('lançamento do filme é obrigatorio')
        }
        if(filmesnovos.disponivel == undefined){
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



server.put('/filme/capa',upload.single('capa') ,async (req, resp)=>{
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

    server.get('/filme/busca', async (req, resp) => {
        try {
            const  { nome }  = req.query;
    
            const resposta = await buscarPorNome(nome);
    
            if (!resposta)
            resp.status(404).send([])
            else
            resp.send(resposta);
        }
        catch (err) {
            resp.status(400).send({
                erro: err.message
            })
        }
    })

    server.get('/filme/:id', async (req, resp) => {
        try {
            const  id  = Number (req.params.id);
    
            const resposta = await buscarPorID(id);
    
            if (!resposta)
            resp.status(404).send([])
            else
            resp.send(resposta);
        }
        catch (err) {
            resp.status(400).send({
                erro: err.message
            })
        }
    })


server.get('/filme', async (req, resp) => {
    try {
        const resposta = await ListarTodosFilmes();
        resp.send(resposta);
    }
    catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const resposta = await removerFilme(id);

        if (resposta != 1)
        throw new Error('Filme não pode ser removido');

        resp.status(204).send();
    }
    catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const filme = req.body;

        if(!filme.nome){
            throw new Error('nome do filme é obrigatorio')
        }
        if(!filme.sinopse){
            throw new Error('sinopse do filme é obrigatorio')
        }
        if(!filme.avaliacao == undefined || filme.avaliacao < 0){
            throw new Error('avaliação do filme é obrigatorio')
        }
        if(!filme.lancamento){
            throw new Error('lançamento do filme é obrigatorio')
        }
        if(filme.disponivel == undefined){
            throw new Error('campo disponivel é obrigatorio')
        }
        if(!filme.usuario){
            throw new Error('usuario não logado')
        }

        const resposta = await alterarFilme(id, filme);
        if (resposta != 1 )
            throw new Error("Filme não pode ser alterado");
            else
                resp.status(204).send();

    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }

})


export default server;

