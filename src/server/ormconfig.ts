import { ConnectionOptions } from "typeorm";
import { __prod__ } from "../constants";
import {
    Course,
    CourseUserMeta,
    Question,
    Queue,
    Room,
    User,
    WeeklyEvent,
} from "./entities";
import { CourseStaff } from "./entities/course-staff";

export default {
    type: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PW,
    port: Number(process.env.DB_PORT) || 5432,
    entities: [
        Course,
        CourseStaff,
        CourseUserMeta,
        Question,
        Queue,
        Room,
        User,
        WeeklyEvent,
    ],
    migrations: [
        __prod__
            ? "build/server/migrations/*.js"
            : "src/server/migrations/*.ts",
    ],
    logging: false && !__prod__ && ["error", "schema", "warn", "query"],
    cli: {
        migrationsDir: __prod__
            ? "build/server/migrations/*.js"
            : "src/server/migrations",
    },
} as ConnectionOptions;
