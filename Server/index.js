import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import pkg from "pg";

config();
const app = express();

app.listen(3001, () => {
	console.log(`running on port 3001`);
});

app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(
	cors({
		origin: ["http://localhost:3000", "https://gaming-db-react-front.vercel.app"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use(express.json({ limit: "5mb" }));

const { Pool } = pkg;

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.PORT,
});

app.get("/get", async (req, res) => {
	const client = await pool.connect();
	console.log("client", client);
	try {
		const result = await client.query('select * from "Users"');
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getrecentgames", async (req, res) => {
	const client = await pool.connect();
	try {
		const result = await client.query('SELECT * FROM "Games" ORDER BY "Game_ID" DESC LIMIT 4');
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getgames", async (req, res) => {
	const client = await pool.connect();
	try {
		const result = await client.query('SELECT * from "Games"');
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getlastreviews", async (req, res) => {
	const client = await pool.connect();
	try {
		const result = await client.query(
			'SELECT * FROM "Reviews" INNER JOIN "Games" ON "Reviews"."Game_ID" = "Games"."Game_ID" ORDER BY "Review_ID" DESC LIMIT 4'
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/insert", async (req, res) => {
	const client = await pool.connect();
	try {
		const { userName, userEmail, userPassword } = req.body;
		const query = `
		INSERT INTO "Users" ("User_Name", "Email", "Password")
		VALUES ($1, $2, $3)
		RETURNING *;`;
		const result = await client.query(query, [userName, userEmail, userPassword]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/savereview", async (req, res) => {
	const client = await pool.connect();
	try {
		const { review, rating, platform, user, gameid, userId } = req.body;
		const query = `
		INSERT INTO "Reviews" ("Game_Review", "Game_Rating", "Platform", "User", "Game_ID", "User_Id")
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *
		`;
		const result = await client.query(query, [review, rating, platform, user, gameid, userId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getmyreviews", async (req, res) => {
	const client = await pool.connect();
	try {
		const { userId } = req.query;
		const query = `SELECT * FROM "Reviews" INNER JOIN "Games" ON "Reviews"."Game_ID" = "Games"."Game_ID" WHERE "User_Id" = $1`;
		const result = await client.query(query, [userId]);
		console.log(userId);
		console.log("result", result.rows);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.put("/updatereview", async (req, res) => {
	const { review, rating, platform, reviewID } = req.body;
	const client = await pool.connect();
	const query = `UPDATE "Reviews" SET "Game_Review" = $1, "Game_Rating" = $2, "Platform" = $3 WHERE "Review_ID" = $4`;
	const result = await client.query(query, [review, rating, platform, reviewID]);
	res.json(result.rows);
	try {
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getreviewinfo", async (req, res) => {
	const client = await pool.connect();
	try {
		const { reviewID } = req.query;
		const query = `select * from "Reviews" INNER JOIN "Games" ON "Reviews"."Game_ID" = "Games"."Game_ID" WHERE "Review_ID" = $1`;
		const result = await client.query(query, [reviewID]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.delete("/deleteReview", async (req, res) => {
	const client = await pool.connect();
	try {
		const { reviewID } = req.query;
		const query = `DELETE FROM "Reviews" WHERE "Review_ID" = $1`;
		const result = await client.query(query, [reviewID]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/createList", async (req, res) => {
	const client = await pool.connect();
	try {
		const { listName, userId } = req.body;
		console.log(listName);
		const query = `INSERT INTO "Lists" ("List_Name", "User_Id")
			VALUES ($1, $2)
			RETURNING *`;
		const result = await client.query(query, [listName, userId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getLists", async (req, res) => {
	const client = await pool.connect();
	try {
		const { userId } = req.query;
		const query = `SELECT * FROM "Lists" WHERE "User_Id" = $1`;
		const result = await client.query(query, [userId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/addToLIst", async (req, res) => {
	const client = await pool.connect();
	try {
		const { listId, gameId } = req.body;
		const query = `INSERT INTO "ListGames" ("List_Id", "Game_Id") VALUES ($1, $2)`;
		const result = await client.query(query, [listId, gameId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getListImg", async (req, res) => {
	const client = await pool.connect();
	try {
		const { userId } = req.query;
		const query = `SELECT "Lists"."List_Id", "Games"."Game_Img", "Games"."Game_ID"
						FROM "Lists"
						JOIN "ListGames" ON "Lists"."List_Id" = "ListGames"."List_Id"
						JOIN "Games" ON "ListGames"."Game_Id" = "Games"."Game_ID"
						WHERE "Lists"."User_Id" = $1`;
		const result = await client.query(query, [userId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getListGames", async (req, res) => {
	const client = await pool.connect();
	try {
		const result = await client.query(`SELECT * FROM "ListGames"`);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getThisListGames", async (req, res) => {
	const client = await pool.connect();
	const { listId } = req.query;
	try {
		const query = `SELECT "Lists"."List_Id", "Games"."Game_Img", "Games"."Game_ID", "Games"."Game_Title"
						FROM "Lists"
						JOIN "ListGames" ON "Lists"."List_Id" = "ListGames"."List_Id"
						JOIN "Games" ON "ListGames"."Game_Id" = "Games"."Game_ID"
						WHERE "Lists"."List_Id" = $1`;
		const result = await client.query(query, [listId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.delete("/deleteList", async (req, res) => {
	const { listId } = req.query;
	const client = await pool.connect();
	try {
		const query = `DELETE FROM "Lists" WHERE "List_Id" = $1`;
		const result = await client.query(query, [listId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.delete("/deleteListGame", async (req, res) => {
	const { listId, gameId } = req.query;
	const client = await pool.connect();
	try {
		const query = `DELETE FROM "ListGames" WHERE "List_Id" = $1 AND "Game_Id" = $2`;
		const result = await client.query(query, [listId, gameId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getlikes", async (req, res) => {
	const client = await pool.connect();
	try {
		const result = await client.query(`SELECT * FROM "Likes"`);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/savelike", async (req, res) => {
	const { userId, reviewId } = req.body;
	const client = await pool.connect();
	console.log(userId, reviewId);
	try {
		const query = `INSERT INTO "Likes" ("User_Id", "Review_Id") VALUES ($1, $2)`;
		const result = client.query(query, [userId, reviewId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.delete("/deletelike", async (req, res) => {
	const { userId, reviewId } = req.query;
	console.log("delete");
	console.log(userId, reviewId);
	const client = await pool.connect();
	try {
		const query = `DELETE FROM "Likes" WHERE "User_Id" = $1 AND "Review_Id" = $2`;
		const result = await client.query(query, [userId, reviewId]);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.get("/getcomments", async (req, res) => {
	const client = await pool.connect();
	try {
		const query = `SELECT "Comments".*, "Users"."User_Name"
						FROM "Comments"
						INNER JOIN "Users"
						ON "Comments"."User_Id" = "Users"."User_Id"`;
		const result = await client.query(query);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});

app.post("/savecomment", async (req, res) => {
	const client = await pool.connect();
	const { comment, userId, reviewId } = req.body;
	console.log(comment, userId, reviewId);
	try {
		const query = `INSERT INTO "Comments" ("Comment", "User_Id", "Review_Id") VALUES ($1, $2, $3)`;
		const result = await client.query(query, [comment, userId, reviewId]);
		console.log(result.rows);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error.stack);
		res.status(500).send("Error executing query");
	} finally {
		client.release();
	}
});
