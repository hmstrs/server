const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const exampleGraphQLType =  require('./exampleType');
const Example = require('../mongo/example');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    example: {
      type: exampleGraphQLType,
      args: { id: { type: GraphQLString }},
      resolve(parent, args) {
        return Example.findById('')
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
});
