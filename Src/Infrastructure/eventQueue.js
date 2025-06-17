
export class EventQueue {
    constructor(eventSource, read, write, group, consumer) {
        this.eventSource = eventSource;
        this.STREAM_KEY_READ = read;
        this.STREAM_KEY_WRITE = write;
        this.GROUP_NAME = group;
        this.CONSUMER_NAME = consumer;
    }

    // Ensure stream and group exist
    async initStream() {
        try {
            if (this.STREAM_KEY_READ) {
                console.log("Creating group: ", this.STREAM_KEY_READ, this.GROUP_NAME);
                await this.eventSource.xGroupCreate(this.STREAM_KEY_READ, this.GROUP_NAME, '0', { MKSTREAM: true });
            }
        } catch (e) {
            if (!e.message.includes('BUSYGROUP')) {
                console.log("Error while creating group: ", this.STREAM_KEY_READ, this.GROUP_NAME, e);
                throw e;
            };
        }
        try {
            if (this.STREAM_KEY_WRITE) {
                console.log("Creating group: ", this.STREAM_KEY_WRITE, this.GROUP_NAME);
                await this.eventSource.xGroupCreate(this.STREAM_KEY_WRITE, this.GROUP_NAME, '0', { MKSTREAM: true });
            }
        } catch (e) {
            if (!e.message.includes('BUSYGROUP')) {
                console.log("Error while creating group: ", this.STREAM_KEY_WRITE, this.GROUP_NAME, e);
                throw e;
            };
        }

    }

    // Publish event to stream
    async publishEvent(eventData) {
        const data = JSON.stringify(eventData);
        const id = await this.eventSource.xAdd(this.STREAM_KEY_WRITE, '*', { data });
        return id;
    }

    async hasPendingMessages() {
        try {
            const pending = await this.eventSource.xPending(this.STREAM_KEY_WRITE, this.GROUP_NAME);
            return pending && pending.count > 0;
        } catch (err) {
            console.error('Error checking pending messages:', this.STREAM_KEY_WRITE, this.GROUP_NAME, err);
            return false;
        }
    }

    // Consume events from stream
    async consumeEvent(handlerFn) {
        console.log("Start listening to queue:", this.GROUP_NAME, this.STREAM_KEY_READ, this.CONSUMER_NAME);
        while (true) {
            const messages = await this.eventSource.xReadGroup(
                this.GROUP_NAME,
                this.CONSUMER_NAME,
                [{ key: this.STREAM_KEY_READ, id: '>' }],
                { COUNT: 10, BLOCK: 5000 }
            );
            if (messages) {
                for (const msg of messages[0].messages) {
                    try {
                        await handlerFn(msg.message);
                        await this.eventSource.xAck(this.STREAM_KEY_READ, this.GROUP_NAME, msg.id);
                        console.log("Processed new message: ", msg.id, this.GROUP_NAME, this.STREAM_KEY_READ);
                    } catch (err) {
                        console.error('Error processing message', msg.id, this.GROUP_NAME, this.STREAM_KEY_READ, err);
                    }
                }
            }
        }
    }
}