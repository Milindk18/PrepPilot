/** @type { import("drizzle-kit").Config } */
export default {
    dialect: "postgresql",
    schema: "./utils/schema.js",
    dbCredentials: {
        url: 'postgresql://neondb_owner:2cgQxBdTVp6j@ep-calm-tree-a15e388v.ap-southeast-1.aws.neon.tech/PrepPilot?sslmode=require',
    }
};