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
        res.status(errMessages.MISSING_TYPING_DNA_INFO.code);
        res.send({
            message: errMessages.MISSING_TYPING_DNA_INFO.message
        })
    }
    axios.post(`${urls.TYPING_DNA_AUTO}/${id}`, data, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}

export const typingDNAGetUser = async (req: express.Request, res: express.Response) => {

    const id = req.body.id;
    if(!id){
        res.status(errMessages.NO_TYPING_DNA_ID.code);
        res.send({
            message: errMessages.NO_TYPING_DNA_ID.message
        })
    }

    axios.get(`${urls.TYPING_DNA_USER}/${id}`, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}

export const typingDNADeleteUser = async (req: express.Request, res: express.Response) => {

    const id = req.body.id;
    if(!id){
        res.status(errMessages.NO_TYPING_DNA_ID.code);
        res.send({
            message: errMessages.NO_TYPING_DNA_ID.message
        })
    }

    axios.delete(`${urls.TYPING_DNA_USER}/${id}`, {
        auth: {
            username: vars.typingDNAKey,
            password: vars.typingDNASecret
        }
    }).then((response) => {
        res.send(response.data);
    }).catch(err => onAxiosError(err, res))

}


