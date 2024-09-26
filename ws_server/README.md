# Betting APP Project

This project is a Node.js Socket.io server built with Express and TypeScript, following Hexagonal Architecture and using Awilix for Dependency Injection. It employs BullMQ as a message broker for asynchronous communication with a HTTP service and background job execution.

## Features

- **Hexagonal Architecture**: Organized code into distinct layers for better maintainability and scalability.
- **Awilix**: Dependency Injection container for managing application dependencies.
- **RabbitMQ**: Message broker for asynchronous communication with HTTP service.
- **Winston & Morgan**: Extensive Logging


## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Events Documentation](#events-documentation)

## Installation

To get started with this project, follow these steps:

1. **Clone the Repository**

```
git clone https://github.com/petlight45/ws_server_betting_app.git
```


2. **Change directory 
```
cd ws_server_betting_app
```   
## Configuration
   
  
3. **Set up environmental variables**

   ```bash
   cp .env.example .env
   ```
 Update the .env file with your local configuration values.
 
 
 EXPRESS_APP_SERVER_PORT=The target port to run this server on
 
 EXPRESS_APP_HTTP_SERVER_PRIVATE_ENDPOINT_SECRET_KEY=The private secret key of this server for synchronous inter-service communication from the HTTP server

 EXPRESS_APP_HTTP_SERVER_BASE_URL=The base endpoint url of the HTTP server

 EXPRESS_APP_REDIS_URL= The connection uri to the message queue(Rabbit MQ) used by this server for asynchronous inter-service communication with the Websocket server 
 
 EXPRESS_APP_MESSAGE_QUEUE_NAME_WEBSOCKET_SERVICE=The queue name that binds this server and the websocket server together, this server sends to this queue, while the WS server consumes from it

 

 ## Running the Server
 
 To run the server:
 
 Install docker and docker compose on your operating environment
 
 For linux, Windows or Old Mac run
 
    ```
    docker-compose up --build
    ```
    
For newer Mac

      ```
      docker compose up --build
    
## Postman Documentation
 
 Link to postman documentation:
 
https://documenter.getpostman.com/view/16065705/2sAXqy1djb