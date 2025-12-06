export const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID || 'lead-service',
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    groupId: process.env.KAFKA_CONSUMER_GROUP || 'lead-consumer-group',
    topics: {
      leadEvents: process.env.KAFKA_TOPIC_LEAD_EVENTS || 'lead-events',
    },
  };