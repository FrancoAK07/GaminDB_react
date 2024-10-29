import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function List() {
	const listId = sessionStorage.getItem("listId");
	const [listGames, setListGames] = useState([]);

	useEffect(() => {
		axios
			.get("https://gamingdbreactserver-production.up.railway.app/getThisListGames", { params: { listId: listId } })
			.then((data) => {
				console.log(data.data);
				setListGames(data.data);
			});
	}, [listId]);

	function deleteListGame(listId, gameId) {
		console.log(gameId);
		if (window.confirm(`remove game from list ${listGames[0].List_Name}`)) {
			axios
				.delete("https://gamingdbreactserver-production.up.railway.app/deleteListGame", {
					params: { listId: listId, gameId: gameId },
				})
				.then((data) => {
					console.log(data);
					toast.success("game removed", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
					axios
						.get("https://gamingdbreactserver-production.up.railway.app/getThisListGames", { params: { listId: listId } })
						.then((data) => {
							setListGames(data.data);
						});
				});
		}
	}
	return (
		<div className="container mb-3">
			<div className="row text-center">
				<h1 className="text-white mt-2">{listGames[0]?.List_Name}</h1>
			</div>

			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 w-75 m-auto row-gap-1">
				{listGames.map((game, index) => {
					return (
						<div className="gamecol col rounded p-2 position-relative" key={game.Game_ID}>
							<div className="d-block h-100">
								<img
									className="myreview-game rounded w-100 "
									src={require(`../assets/images/${game.Game_Img}`)}
									alt={"game title"}
								/>
								<div className="hover-name position-absolute top-50 start-50 translate-middle text-white fw-bold text-center">
									{game.Game_Title}
								</div>
							</div>
							<div className="delete-listGame-icon position-absolute rounded-5">
								<img
									className="bg-secondary rounded-5"
									src={require("../assets/images/trashcan2.png")}
									alt=""
									onClick={() => deleteListGame(game.List_Id, game.Game_ID)}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default List;
