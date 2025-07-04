export class HttpError extends Error {
    status?: number; // for compatibility with standard Error type

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}
