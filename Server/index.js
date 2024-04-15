import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getConnection, sql } from "./database/connection.js";
import { config } from "dotenv";

config();
const app = express();

app.listen(3001, () => {
	console.log(`running on port ${process.env.PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/get", async (req, res) => {
	const pool = await getConnection();
	const result = await pool.request().query("select * from users");
	res.json(result.recordset);
});

app.post("/insert", async (req, res) => {
	const { userName, userEmail, userPassword } = req.body;
	const pool = await getConnection();
	const result = await pool
		.request()
		.input("username", sql.VarChar, userName)
		.input("useremail", sql.VarChar, userEmail)
		.input("userpassword", sql.VarChar, userPassword)
		.query("INSERT INTO Users (User_Name, Email, Password) VALUES (@username, @useremail, @userpassword)");
	res.json(result);
});

app.post("/savereview", async (req, res) => {
	const { review, rating, platform, user, gameid, userId } = req.body;

	const pool = await getConnection();
	const result = await pool
		.request()
		.input("review", sql.VarChar, review)
		.input("rating", sql.Int, rating)
		.input("platform", sql.VarChar, platform)
		.input("user", sql.VarChar, user)
		.input("gameid", sql.Int, gameid)
		.input("userid", sql.Int, userId)
		.query(
			"INSERT INTO Reviews (Game_Review, Game_Rating, Platform, [User], Game_ID, [User_Id]) VALUES (@review, @rating, @platform, @user, @gameid, @userid)"
		);
	res.json(result);
});

app.get("/getlastreviews", async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.query("select TOP 4 *FROM Reviews INNER JOIN Games ON Reviews.Game_ID = Games.Game_ID ORDER BY Review_ID DESC");
		res.json(result.recordset);
		console.log(result.recordset);
		console.log("get last reviews");
	} catch (error) {
		console.log(error);
	}
});

app.get("/getgames", async (req, res) => {
	const pool = await getConnection();
	const result = await pool.request().query("select * from Games");
	res.json(result.recordset);
});

app.get("/getrecentgames", async (req, res) => {
	const pool = await getConnection();
	const result = await pool.request().query("SELECT TOP 4 *FROM Games ORDER BY Game_ID DESC");
	res.json(result.recordset);
});

app.get("/getmyreviews", async (req, res) => {
	const { userId } = req.query;

	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input("userid", sql.Int, userId)
			.query("select * from Reviews INNER JOIN Games ON Reviews.Game_ID = Games.Game_ID where [User_Id] = @userId");
		res.json(result.recordset);
	} catch (error) {
		console.log(error);
	}
});

app.put("/updatereview", async (req, res) => {
	const { review, rating, platform, reviewID, gameID } = req.body;

	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input("review", sql.VarChar, review)
			.input("rating", sql.Int, rating)
			.input("platform", sql.VarChar, platform)
			.input("reviewid", sql.Int, reviewID)
			.input("gameid", sql.Int, gameID)
			.query("EXEC edit_review @review = @review, @rating = @rating, @platform = @platform, @reviewid = @reviewid, @gameid = @gameid");
		res.json(result.recordset);
	} catch (error) {
		console.log(error);
	}
});

app.get("/getreviewinfo", async (req, res) => {
	const { reviewID } = req.query;

	const pool = await getConnection();
	const result = await pool
		.request()
		.input("reviewid", sql.Int, reviewID)
		.query("select * from Reviews INNER JOIN Games ON Reviews.Game_ID = Games.Game_ID WHERE Review_ID = @reviewid");
	res.json(result.recordset);
});
app.put("/savebackground", async (req, res) => {
	const { backgroundImg, id } = req.body;

	const pool = await getConnection();
	await pool
		.request()
		.input("backgroundimg", sql.VarChar, backgroundImg)
		.input("id", sql.Int, id)
		.query("UPDATE games SET Game_background = @backgroundimg WHERE Game_ID = @id");
});

app.delete("/deleteReview", async (req, res) => {
	try {
		const { reviewID } = req.query;
		const pool = await getConnection();
		const result = await pool.request().input("reviewId", sql.Int, reviewID).query("DELETE FROM reviews WHERE Review_ID = @reviewId");
		console.log(result);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
});

app.post("/createList", (req, res) => {
	const { listName, userId } = req.body;
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("listname", sql.VarChar, listName)
				.input("userid", sql.Int, userId)
				.query("INSERT INTO Lists (List_Name, User_Id ) VALUES (@listname, @userid)")
				.then((result) => {
					res.json(result.status);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/getLists", (req, res) => {
	const { userId } = req.query;
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("userid", sql.Int, userId)
				.query("SELECT * from Lists WHERE [User_Id] = @userid")
				.then((result) => {
					console.log(result);
					res.json(result.recordset);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.post("/addToList", (req, res) => {
	const { listId, gameId } = req.body;
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("listid", sql.Int, listId)
				.input("gameid", sql.Int, gameId)
				.query("INSERT INTO ListGames (List_Id, Game_Id ) VALUES (@listid, @gameid)")
				.then((result) => {
					console.log(result);
					res.json(result);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/getListImg", (req, res) => {
	const { userId } = req.query;
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("userid", sql.Int, userId)
				.query(
					"SELECT Lists.List_Id, Games.Game_Img, Games.Game_ID FROM Lists JOIN ListGames ON Lists.List_id = ListGames.List_Id JOIN Games ON ListGames.Game_Id = Games.Game_ID WHERE Lists.User_Id = @userid"
				)
				.then((result) => {
					console.log(result.recordset);
					res.json(result.recordset);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/getListGames", (req, res) => {
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.query("SELECT * FROM ListGames")
				.then((data) => {
					console.log(data);
					res.json(data.recordset);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/getThisListGames", (req, res) => {
	const { listId } = req.query;
	console.log(listId);
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("listid", sql.Int, listId)
				.query(
					"SELECT Lists.List_Name, Lists.List_Id, Games.Game_Img, Games.Game_ID, Games.Game_Title FROM Lists JOIN ListGames ON Lists.List_id = ListGames.List_Id JOIN Games ON ListGames.Game_Id = Games.Game_ID WHERE Lists.List_Id = @listid"
				)
				.then((data) => {
					console.log(data.recordset);
					res.json(data.recordset);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.delete("/deleteList", (req, res) => {
	const { listId } = req.query;
	console.log("hello", listId);
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("listid", sql.Int, listId)
				.query("DELETE FROM Lists WHERE List_Id = @listid")
				.then((data) => {
					console.log(data);
					res.json(data);
				});
		});
	} catch (error) {
		console.log(error);
	}
});

app.delete("/deleteListGame", (req, res) => {
	const { listId, gameId } = req.query;
	console.log(req.query);
	try {
		getConnection().then((pool) => {
			pool
				.request()
				.input("listid", sql.Int, listId)
				.input("gameid", sql.Int, gameId)
				.query("DELETE FROM ListGames WHERE List_Id = @listid AND Game_Id = @gameid")
				.then((data) => {
					console.log(data);
					res.json(data);
				});
		});
	} catch (error) {
		console.log(error);
	}
});
