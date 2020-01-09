require('dotenv').config();

const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const jwt = require('jsonwebtoken');

const schemas = require('./graphql/schemas');
const resolvers= require('./graphql/resolvers');

const userModel = require('./mongo/models/UserModel')
const eventModel = require('./mongo/models/EventModel')

const app = new Koa();

const getUser = async (req) => {
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
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 4000 }, () => {
	require('./mongo/db')();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
