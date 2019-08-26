import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import _ from 'lodash';
import TagModel from '../../db/models/Tag';

const TagType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: { type: GraphQLID },
    guildID: { type: GraphQLID },
    userID: { type: GraphQLID },
    tag: { type: GraphQLString },
  }),
});

const RootQuery: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tag: {
      type: TagType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return TagModel.findOne({ id: args.id });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
