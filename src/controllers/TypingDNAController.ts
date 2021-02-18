import express from "express";
import { paths } from "../config/Config";
import { typingDNAVerify, typingDNAGetUser, typingDNADeleteUser } from "../services/TypingDNAService";

export default function TypingDNAController(app: express.Application){

    app.post(paths.TYPING_DNA_VERIFY, typingDNAVerify);

    app.post(paths.TYPING_DNA_GET_USER, typingDNAGetUser);

    app.delete(paths.TYPING_DNA_DELETE_USER, typingDNADeleteUser);

}