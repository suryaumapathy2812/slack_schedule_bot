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
            .send("Message Sent Successfully");

    } catch (error) {

        console.log(error)
        res.statusMessage = "Failed to Send Message";
        res.status(400)
            .send("Failed to Send Message")

    }
})


commandController.post("/create_poll", async (req, res) => {
    try {

        console.log("create_poll ========================");
        console.log(req.body)

        const commandService = new CommandService();
        const model = await commandService.createPollModel(req);

        console.log(model);
        res.statusMessage = "Model Opened Successfully"
        res.status(200)
            .send("Model Opened Successfully");


    } catch (error) {
        console.log(error)
        res.statusMessage = "Failed to Open modal";
        res.status(400)
            .send("Failed to Open modal")
    }
})


export { commandController };