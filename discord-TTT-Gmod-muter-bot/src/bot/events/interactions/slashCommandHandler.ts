import BaseEvent from "../../../utils/structs/baseEvent";
import { Client, Interaction } from "discord.js";

export default class SlashCommandHandler extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }
    execute(client: Client<boolean>, ...args: any[]): void {
        console.log(args);
    }
}