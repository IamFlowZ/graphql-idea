import * as fs from "fs";
import * as path from "path";

import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server-micro";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import neo4j from "neo4j-driver";
import resolvers from "../resovlers/resolver";

const NEO4J_USER = process.env.NEO4J_USER || "neo4j";
const NEO4J_PSWD = process.env.NEO4J_PSWD || "letmein";
const NEO4J_URL = process.env.NEO4J_URL || "bolt://localhost:7687";

// console.log(path.join(__dirname, "schema.graphql"));
// console.log("./");

const modifiedSchema = makeAugmentedSchema({
  typeDefs: fs
    .readFileSync(
      "/home/dakotal/Projects/PlayStuff/SSR-CMS/ssr-cms/pages/api/schema.graphql"
    )
    .toString(),
  resolvers,
  allowUndefinedInResolve: true,
  config: {
    query: {
      exclude: ["Type", "Any"],
    },
    mutation: {
      exclude: ["Type", "Any"],
    },
  },
});

const driver = neo4j.driver(
  NEO4J_URL,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PSWD)
);

const apolloServer = new ApolloServer({
  formatResponse: (resp) => {
    console.log("got a request");
    return resp;
  },
  formatError: (err) => {
    console.error(err);
    return err;
  },
  schema: modifiedSchema,
  context: { driver },
  introspection: true,
  playground: true,
  subscriptions: false,
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
