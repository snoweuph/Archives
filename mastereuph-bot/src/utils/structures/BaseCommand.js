module.exports = class BaseCommand {
    constructor(data, category = ''){
        this.data = data;
        this.category = category;
    }
}