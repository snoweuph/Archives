import { Client, ClientEvents } from "discord.js";

export default abstract class BaseEvent {
    event: keyof ClientEvents;

    constructor(event: keyof ClientEvents) {
        this.event = event;
    }

    abstract execute(client: Client, ...args: any[]): void;
}