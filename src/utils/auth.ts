import { FastifyReply } from "fastify";
import { sign, verify } from "jsonwebtoken";
import { User } from "src/entity/User";
import { RequestContext } from "src/utils/RequestContext";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const sendRefreshToken = (reply: FastifyReply, user: User) => {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  reply.setCookie("jid", createRefreshToken(user), {
    httpOnly: true,
    expires: date,
    sameSite: "strict",
    path: "/refreshToken",
    secure: process.env.NODE_ENV === "production",
  });
};

export const isAuthenticated: Middleware<RequestContext> = (
  { context },
  next
) => {
  const authorization = context.request.headers["authorization"];
  try {
    if (!authorization) throw new Error("not authenticated");
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.error(err);
    throw new Error("not authenticated");
  }

  return next();
};
