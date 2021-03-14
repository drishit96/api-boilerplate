function getDbConnectionOptions() {
  if (process.env.DB_TO_CONNECT === "postgres") {
    return {
      type: process.env.DB_TO_CONNECT!,
      host: process.env.DB_HOST!,
      port: process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME!,
      synchronize: true,
      logging: process.env.NODE_ENV !== "production",
      entities: ["src/entity/**/*.ts"],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
      cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
      },
    } as any;
  } else if (process.env.DB_TO_CONNECT === "mongodb") {
    return {
      type: process.env.DB_TO_CONNECT!,
      host: process.env.DB_HOST!,
      port: process.env.DB_PORT!,
      database: process.env.DB_NAME!,
      synchronize: true,
      logging: process.env.NODE_ENV !== "production",
      entities: ["src/entity/**/*.ts"],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
      cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
      },
    };
  } else {
    return undefined;
  }
}

export = getDbConnectionOptions;
