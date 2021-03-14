import "reflect-metadata";
import fastify from "fastify";
import dbConnector from "./plugins/dbconnection";
import { User } from "./entity/User";
import { ApolloServer } from "apollo-server-fastify";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import * as dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import { createAccessToken, sendRefreshToken } from "./utils/auth";
import { fastifyCookie } from "fastify-cookie";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const server = fastify();

(async function () {
  try {
    fastifyCookie(
      server,
      {
        secret: process.env.COOKIE_SECRET,
      },
      (err) => {
        if (err) console.error(err);
      }
    );
    server.register(dbConnector);
    server.register(
      new ApolloServer({
        schema: await buildSchema({
          resolvers: [UserResolver],
        }),
        context: ({ request, reply }) => ({ request, reply }),
      }).createHandler()
    );
    const address = await server.listen(process.env.PORT!);
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

/**
 * path to get a new access token when the previous one expires.
 * validates the refresh token in the cookie and returns a new access token
 */
server.post("/refreshToken", async (request, reply) => {
  const token = request.cookies.jid;
  if (!token) {
    return reply.send({ ok: false, accessToken: "" });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.error(err);
    return reply.send({ ok: false, accessToken: "" });
  }

  const user = await User.findOne({ where: { _id: payload.userId } });
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    return reply.send({ ok: false, accessToken: "" });
  }

  sendRefreshToken(reply, user);
  return reply.send({ ok: true, accessToken: createAccessToken(user) });
});
