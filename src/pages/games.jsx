import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Games({ getID, getGameImg, getBackground, getGameID }) {
	const [games, setGames] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [userLists, setUserLists] = useState([]);
	const userLogged = sessionStorage.getItem("logged");
	const userId = sessionStorage.getItem("userId");
	const addToListFormRef = useRef(null);
	const [showListsForm, setShowListsForm] = useState(false);
	let listsId = [];
	const gameid = useRef();
	const addToListBtnRef = useRef([]);
	const [listGames, setListGames] = useState();

	useEffect(() => {
		axios.get("http://localhost:3001/getgames").then((data) => {
			setGames(data.data);
		});
	}, []);

	useEffect(() => {
		axios.get("http://localhost:3001/getmyreviews", { params: { userId: userId } }).then((userReviews) => {
			setReviews(userReviews.data);
		});
	}, [userId]);

	useEffect(() => {
		axios.get("http://localhost:3001/getLists", { params: { userId: userId } }).then((lists) => {
			console.log(lists.data);
			console.log(userId);
			setUserLists(lists.data);
		});
	}, [userId]);

	useEffect(() => {
		axios.get("http://localhost:3001/getListGames").then((data) => {
			console.log(data.data);
			setListGames(data.data);
		});
	}, []);

	function checkReview(gameID) {
		if (userLogged) {
			for (let review of reviews) {
				if (gameID === review.Game_ID[0]) {
					return "/editreview";
				}
			}
			return "/createreview";
		} else {
			return "/games";
		}
	}

	function checkID(e) {
		for (let review of reviews) {
			if (review.Game_Title === e.target.alt) {
				getID(review.Review_ID);
				return;
			}
		}
		for (let game of games) {
			if (game.Game_Title === e.target.alt) {
				getBackground(game.Game_Background);
				getGameID(game.Game_ID);
				getGameImg(e.target.src);
				return;
			}
		}
	}

	function checkIfLoggedIn() {
		if (!userLogged) {
			toast("Sign in to create a review", { style: { background: "#212529", color: "white", border: "1px solid gray" }, duration: 2000 });
		}
	}

	function addToList(gameId) {
		gameid.current = gameId;
		console.log("gameId", gameid.current);
		setShowListsForm(!showListsForm);
	}

	function addListId(listId) {
		if (listsId.includes(listId)) {
			listsId = listsId.filter((item) => {
				return item !== listId;
			});
		} else {
			listsId.push(listId);
		}
		console.log(listsId);
	}

	function addGameToList() {
		console.log(gameid.current);
		console.log(listsId);
		for (let id of listsId) {
			let alreadyInList = listGames.some((item) => item.List_Id === id && item.Game_Id === gameid.current);

			if (!alreadyInList) {
				console.log("add to database");
				axios.post("http://localhost:3001/addTolist", { listId: id, gameId: gameid.current }).then((result) => {
					console.log(result);
				});
				toast.success("Added successfully", {
					style: {
						background: "#212529",
						color: "white",
						border: "1px solid gray",
					},
				});
			} else {
				console.log("already in list");
			}
		}
		setShowListsForm(false);
	}

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (showListsForm && !addToListFormRef.current.contains(e.target) && !addToListBtnRef.current.includes(e.target)) {
				console.log("useEffect ran");
				setShowListsForm(false);
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	});

	return (
		<div className="container mb-3">
			<div className="row text-center">
				<h1 className="text-white">Games</h1>
			</div>

			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 w-75 m-auto row-gap-1">
				{games.map((game, index) => {
					return (
						<div className="gamecol col rounded p-2 position-relative" key={game.Game_ID} onClick={checkIfLoggedIn}>
							<Link className="d-block h-100" to={checkReview(game.Game_ID)}>
								<img
									className="myreview-game rounded w-100 "
									src={require(`../assets/images/${game.Game_Img}`)}
									alt={game.Game_Title}
									onClick={(e) => {
										checkID(e);
									}}
								/>
								<div className="hover-name position-absolute top-50 start-50 translate-middle text-white fw-bold text-center">{game.Game_Title}</div>
							</Link>
							{userLogged && (
								<div
									className="add-to-list position-absolute bottom-0 start-50 translate-middle bg-dark rounded p-1 text-white"
									ref={(item) => addToListBtnRef.current.push(item)}
									onClick={() => addToList(game.Game_ID)}>
									Add to list
								</div>
							)}
						</div>
					);
				})}
			</div>
			{showListsForm ? (
				<div className="listsForm row position-absolute bg-secondary top-50 start-50 translate-middle p-2 m-auto rounded" ref={addToListFormRef}>
					<div className="col-12 p-1">
						{userLists.map((list, i) => {
							return (
								<div className="list p-1 row justify-content-between w-100 m-auto" key={list.List_Id}>
									<label className="text-white p-0 me-2 w-auto" htmlFor={"list" + i}>
										{list.List_Name}
									</label>
									<input className="w-auto" type="checkbox" name={"list" + i} id="" onClick={() => addListId(list.List_Id)} />
								</div>
							);
						})}
						<div className="row justify-content-center w-100 m-auto">
							<button className="btn btn-primary mt-2 w-auto" onClick={addGameToList}>
								Add
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default Games;
