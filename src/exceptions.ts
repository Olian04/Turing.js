export class Exception extends Error {
    constructor(name: string, msg?: string) {
        super();
        this.name = name;
        this.message = msg || '';
    }
}

export class UnexpectedEOFException extends Exception {
    constructor(msg?: string) {
        super('UnexpectedEOFException', msg); 
    }
}

export class NotImplementedException extends Exception {
    constructor(msg?: string) {
        super('NotImplementedException', msg); 
    }
}