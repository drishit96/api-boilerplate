# API Boilerplate

Boilerplate code for API with authentication.

## Installing

1. Run `npm i` command
2. Add secrets and db details to the `.env` file
3. If you want to use MongoDB, replace `postgres` with `mongodb` in `.env` file. Also, in `User.ts` file, follow the comments to properly setup mongodb
4. Run `npm start` command

## Built With

* [Fastify](https://www.fastify.io/docs/latest/) - The web framework used
* [TypeORM](https://typeorm.io/#/) - ORM used
* [GraphQL](https://graphql.org/) - Query language for API

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
