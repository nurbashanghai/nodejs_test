const ormConfig = require('ormconfig');

const config = {
    ...ormConfig,
    migrations: [process.env.ORM_MIGRATIONS],
    cli: {
        migrationsDir: process.env.ORM_MIGRATIONS_DIR
    },
    autoLoadEntities: false,
    entities: [process.env.ORM_ENTITIES]
};

console.log('config', process.env.ORM_MODE, config);

module.exports = config;
