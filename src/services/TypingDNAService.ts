import express from "express";
import { urls, vars, errMessages } from "../config/Config";
import axios from "axios";
import { onAxiosError } from "../errors/ErrorHandler";


export const typingDNAVerify = async (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    const data = {
        tp: req.body.tp
    };
    if(!id || !data){
        let message = {
            message: errMessages.MISSING_TYPING_DNA_INFO.message
        }
        console.log(JSON.stringify(message));
        res.status(errMessages.MISSING_TYPING_DNA_INFO.code);
        res.send(message)
    }
    console.log(`POSTING TO TYPING DNA WITH ${JSON.stringify(data)}`)
    axios.post(`${urls.TYPING_DNA_AUTO}/${id}`, data, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        console.log(JSON.stringify(response.data));
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}

export const typingDNAGetUser = async (req: express.Request, res: express.Response) => {

    const id = req.body.id;
    if(!id){
        let message = {
            message: errMessages.NO_TYPING_DNA_ID.message
        }
        console.log(message);
        res.status(errMessages.NO_TYPING_DNA_ID.code);
        res.send(message)
    }
    console.log(`GETTING ${id} FROM TYPING DNA`)
    axios.get(`${urls.TYPING_DNA_USER}/${id}`, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        console.log(JSON.stringify(response.data));
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}

export const typingDNADeleteUser = async (req: express.Request, res: express.Response) => {

    const id = req.body.id;
    if(!id){
        let message = {
            message: errMessages.NO_TYPING_DNA_ID.message
        }
        console.log(message)
        res.status(errMessages.NO_TYPING_DNA_ID.code);
        res.send(message);
    }
    console.log(`DELETING ${id} FROM TYPING DNA`);
    axios.delete(`${urls.TYPING_DNA_USER}/${id}`, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        console.log(JSON.stringify(response.data));
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}