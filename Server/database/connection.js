import sql from "mssql";
import { config } from "dotenv";

config();

const dbSettings = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	options: {
		database: process.env.DB_DATABASE,
		encrypt: true,
		trustServerCertificate: true,
	},
};

async function getConnection() {
	try {
		const pool = await sql.connect(dbSettings);

		return pool;
	} catch (error) {
		console.error(error);
	}
}

export { dbSettings, getConnection, sql, config };
