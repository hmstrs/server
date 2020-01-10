require('dotenv').config();

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
      return await jwt.verify(token, 'secret' || process.env.JWT);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    let me = {};
    if (req) {
      me = await getUser(req);
    }

    return {
      me,
      models: {
        userModel,
        eventModel,
      },
    };
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  require('./mongo/db')();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
