const config = {
    type: process.env.ORM_CONNECTION,
    host: process.env.ORM_HOST,
    port: process.env.ORM_PORT,
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    database: process.env.ORM_DATABASE,
    synchronize: process.env.ORM_SYNCHRONIZE === 'true',
    migrations: [],
    cli: {
        migrationsDir: process.env.ORM_MIGRATIONS_DIR
    },
    autoLoadEntities: true,
    entities: [process.env.ORM_ENTITIES]
};

console.log('config', process.env.ORM_MODE, config);

module.exports = config;
