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

export const TagType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: { type: GraphQLID },
    guildID: { type: GraphQLID },
    userID: { type: GraphQLID },
    tag: { type: GraphQLString },
  }),
});
