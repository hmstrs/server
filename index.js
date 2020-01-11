require('dotenv').config();

const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const jwt = require('jsonwebtoken');
const { ApolloServer, AuthenticationError } = require('apollo-server-koa');

const schemas = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');

const userModel = require('./mongo/models/userModel');
const eventModel = require('./mongo/models/eventModel');

const app = new Koa();
app.use(cors());

const getUser = async req => {
  const token = req.headers['token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT || 'secret');
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ ctx: { req } }) => {
    if (req) {
      const me = await getUser(req);
      return {
        me,
        models: {
          userModel,
          eventModel,
        },
      };
    }
  },
  subscriptions: {
    keepAlive: 1000,
    onConnect: async (
      _connectionParams,
      _websocket,
      context
    ) => {
      console.log('WS Connectedl! -> ', JSON.stringify(context));
    },
    onDisconnect: (_websocket, context) => {
      console.log('WS Disconnected! -> ', JSON.stringify(context));
    }
  }
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: false
});

const httpServer = http.createServer(app.callback());

server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: 4000}, (e) => {
  console.error(e);

  require('./mongo/db')();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(
    `🔔 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
  );
});
