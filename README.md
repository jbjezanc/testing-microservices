# Globoticket Demo Microservice API

## Description

This is a demo Node microservice API for a ficticious company named Globoticket.

## Installation

To install package dependencies run the following command:

```bash
npm install
```

### Running Microservices

Each microservice app has a `start` npm script. Ideally you'll run each microservice
in its own terminal instance.

```bash
# command to run order microservice
cd apps/order
npm run start
```

```bash
# command to run inventory microservice
cd apps/order
npm run start:microservice2
```

## Components:

### Order Service:

Receives and processes orders placed by users.
Publishes messages related to ticket purchases, cancellations, or modifications.
Has its own database.

### Inventory Service:

Manages available event ticket inventory.
Subscribes to messages related to ticket requests.
Has its own database.

### Message Broker (ZeroMQ):

Serves as a decentralized queue for message passing.
Manages queues and facilitates communication between microservices.
