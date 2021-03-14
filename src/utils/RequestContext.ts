import { FastifyReply, FastifyRequest } from "fastify";

export interface RequestContext {
  request: FastifyRequest;
  reply: FastifyReply;
  payload: { userId: string };
}
