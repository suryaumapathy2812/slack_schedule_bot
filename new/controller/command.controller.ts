import express from "express";
import { CommandService } from "../services/command.service";

const commandController = express.Router();

commandController.post("/dinner_message", async (req, res) => {
    try {
        console.log("dinner_message ========================");
        console.log(req.body)

        const commandService = new CommandService();

        const messageResponse = await commandService.dinnerMessage(req)

        console.log(messageResponse);
        res.statusMessage = "Message Sent Successfully"
        res.status(200)
            .send();

    } catch (error) {

        console.log(error)
        res.statusMessage = "Failed to Send Message";
        res.status(400)
            .send()

    }
})


export { commandController };