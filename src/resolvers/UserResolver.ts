import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import * as argon2 from "argon2";
import { RequestContext } from "../utils/RequestContext";
import {
  createAccessToken,
  isAuthenticated,
  sendRefreshToken,
} from "../utils/auth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  hello(@Ctx() { payload }: RequestContext) {
    return `hello, ${payload.userId}`;
  }

  @Query(() => User)
  @UseMiddleware(isAuthenticated)
  me(@Ctx() { payload }: RequestContext) {
    return User.findOne({ where: { _id: payload.userId } });
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hash = await argon2.hash(password);
      await User.insert({
        email,
        password: hash,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { reply }: RequestContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Username or password incorrect");

    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) throw new Error("Username or password incorrect");

    sendRefreshToken(reply, user);

    return {
      accessToken: createAccessToken(user),
    };
  }
}
