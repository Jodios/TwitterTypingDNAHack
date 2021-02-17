import express from "express";

export const onAxiosError = (err:Error, res: express.Response) => {
    console.log(err);
    res.status(500)
    res.send(err);
}