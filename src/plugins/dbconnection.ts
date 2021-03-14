import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyTypeorm from "fastify-typeorm-plugin";
import getDbConnectionOptions from "../utils/dbConnectionOptions";

function dbConnector(fastify: FastifyInstance, _options: any, done: any) {
  fastify.register(fastifyTypeorm, getDbConnectionOptions());
  done();
}

export = fastifyPlugin(dbConnector);
