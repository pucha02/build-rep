import amqp from "amqplib";

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("orders");
        console.log("✅ Connected to RabbitMQ");
    } catch (error) {
        console.error("❌ RabbitMQ connection error:", error);
    }
};

const sendToQueue = (queue, message) => {
    if (channel) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📨 Order sent to queue: ${queue}`);
    }
};

export { connectRabbitMQ, sendToQueue };
