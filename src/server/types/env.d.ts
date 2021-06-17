declare namespace NodeJS {
    interface ProcessEnv {
        DB_HOST: string;
        DB_USER: string;
        DB_PW: string;
        DB_NAME: string;
        NODE_ENV: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
    }
}
