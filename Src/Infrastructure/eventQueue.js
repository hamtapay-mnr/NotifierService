
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
            await this.eventSource.xGroupCreate(this.STREAM_KEY_WRITE, this.GROUP_NAME, '0', { MKSTREAM: true });
            console.log('Stream group created');
        } catch (e) {
            if (!e.message.includes('BUSYGROUP')) throw e;
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
            console.error('Error checking pending messages:', err);
            return false;
        }
    }

    // Consume events from stream
    async consumeEvent(handlerFn) {
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
                        await this.eventSource.xAck(STREAM_KEY_READ, GROUP_NAME, msg.id);
                        console.log("Processed new message: ", msg.id, this.GROUP_NAME, this.CONSUMER_NAME);
                    } catch (err) {
                        console.error('Error processing message', msg.id, err);
                    }
                }
            }
        }
    }
}