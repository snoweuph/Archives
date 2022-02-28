import { Client, Interaction } from "discord.js";

export default abstract class BaseButtonInteraction {
    name: string;
    uniqueID: string;

    constructor(name: string, uniqueID: string) {
        this.name = name;
        this.uniqueID = uniqueID;
    }

    abstract execute(client: Client, interaction: Interaction): void;
}