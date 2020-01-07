require('dotenv').config();

const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const schema = require('./graphql/schema');

require('./db')();

const app = new Koa();

app.use(mount('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
})))

app.listen(9000);

app.on('error', err => {
  log.error('server error', err)
});

