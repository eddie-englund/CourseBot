import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import TagModel from '../../db/models/Tag';
import { TagType } from './types';

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
    tags: {
      type: new GraphQLList(TagType),
      resolve(parent, args: { guildID }) {
        return TagModel.find({ guildID: args.guildID });
      },
    },
  },
});

const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    editTag: {
      type: TagType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        guildID: { type: new GraphQLNonNull(GraphQLID) },
        tag: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return TagModel.findOneAndUpdate({
          id: args.id,
          userID: args.userID,
          guildID: args.guildID,
          tag: args.tag,
        });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
