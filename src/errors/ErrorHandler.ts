import { AxiosError } from "axios";
import express from "express";

export const onAxiosError = async (err:AxiosError, res: express.Response) => {
    console.log(err.response.status);
    res.status(err.response.status);
    res.send(err.response.data);
}