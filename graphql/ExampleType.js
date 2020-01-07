const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const ExampleType = new GraphQLObjectType({
  name: 'Example',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    date: { type: GraphQLString },
    price: { type: GraphQLString }
  })
});

module.exports = ExampleType;
