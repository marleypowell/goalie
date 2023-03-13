import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';

const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');

const connectToEventStore = async () => {
  await eventStore.readAll({
    direction: FORWARDS,
    fromPosition: START,
    maxCount: 1,
  });
};

export { eventStore, connectToEventStore };
