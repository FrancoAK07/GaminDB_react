import React, { useState, useEffect } from "react";
import axios from "axios";
import list from "../../assets/images/list_1950715.png";
import ReviewCard from "./reviewCard";

function Home() {
	const [recentGames, setRecentGames] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/getrecentgames").then((data) => {
			setRecentGames(data.data);
		});
	}, []);

	return (
		<div className="home h-100">
			<div className="home-background position-relative w-100">
				<div className="home-gradient w-100 position-absolute"></div>
				<img className="h-100 w-100" src={require("../../assets/images/sc5r7v.png")} alt="" />
				<div className="position-absolute top-0 w-100">
					<div className="container mb-5">
						<div className="row text-center text-white mb-4 pt-4 ">
							<h1>GamingDB</h1>
						</div>
						<div className="row text-start headlines rounded-3 p-3">
							<h2 className="text-white">
								<img src={list} alt="list" /> Create your list of games
							</h2>
							<h2 className="text-white">
								<img src={list} alt="list" /> Review games and read reviews from other players
							</h2>
						</div>
						<div className="row text-center w-50 ms-auto me-auto mt-3">
							<div className="col">
								<div className="row">
									<h1 className="text-light">New Games</h1>
								</div>
								<div className="row row-cols-2 row-cols-md-4">
									{recentGames.length
										? recentGames.map((game, i) => {
												return (
													<div className="col p-1" key={game.Game_ID}>
														<img className="img-fluid" src={require(`../../assets/images/${game.Game_Img}`)} alt="" />
													</div>
												);
											})
										: null}
								</div>
							</div>
						</div>
					</div>
					<div className="row text-center w-100 m-auto mb-3">
						<h1 className="text-white">Recent Reviews</h1>
					</div>
					<ReviewCard />
				</div>
			</div>
		</div>
	);
}

export default Home;
