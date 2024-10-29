import React, { useState, useEffect, useRef } from "react";
import StarRating from "../components/starRating";
import Dropdown from "../components/dropdown";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function EditReview({ reviewID, gameID }) {
	const [file, setFile] = useState(null);
	const [gameFile, setGameFile] = useState(null);
	const [dbRating, setDbRating] = useState(null);
	const reviewRef = useRef("");
	const [platform, setPlatform] = useState("");
	const navigate = useNavigate();

	function getRating(rating) {
		setDbRating(rating);
	}

	function getPlatform(platform) {
		setPlatform(platform);
	}

	useEffect(() => {
		axios
			.get("https://gamingdbreactserver-production.up.railway.app/getreviewinfo", { params: { reviewID: reviewID } })
			.then((data) => {
				setDbRating(data.data[0].Game_Rating);
				setPlatform(data.data[0].Platform);
				reviewRef.current.value = data.data[0].Game_Review;
				setFile(data.data[0].Game_Background);
				setGameFile(data.data[0].Game_Img);
			});
	}, [reviewID]);

	function updateReview() {
		if (!reviewRef.current.value || !dbRating || !platform) {
			alert("please complete the review");
		} else {
			axios
				.put("https://gamingdbreactserver-production.up.railway.app/updatereview", {
					review: reviewRef.current.value,
					rating: parseInt(dbRating),
					platform: platform,
					reviewID: reviewID,
					gameID: gameID,
				})
				.then((result) => {
					console.log("status", result.status);
					toast.success("review updated!", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
					navigate("/reviews");
				});
		}
	}

	return (
		<div className="create-review vh-100 bg-dark container-fluid p-0">
			<div className="background position-relative">
				<div className="gradient position-absolute"></div>
				<img className="background-img w-100 h-100" src={file ? require(`../assets/images/${file}`) : null} alt="" />
				<div className="background-upload position-absolute top-0 start-0 "></div>
				<div className="game-img position-absolute start-50 top-50 translate-middle text-center">
					<img className="img-fluid h-100 w-100" src={gameFile ? require(`../assets/images/${gameFile}`) : null} alt="" />
				</div>
			</div>
			<div className="container">
				<div className="row justify-content-center mt-2 ">
					<div className="col-12 justify-content-center w-75">
						<textarea
							className="d-block w-100 bg-transparent text-white p-2"
							cols="40"
							rows="7"
							ref={reviewRef}
							placeholder="Your Review Here..."></textarea>
						<button
							className="btn btn-primary d-block mx-auto mt-2"
							type="button"
							onClick={() => {
								updateReview();
							}}>
							Update review
						</button>
					</div>
					<div className="col-12 justify-content-between d-flex mt-3">
						<StarRating getRating={getRating} dbRating={dbRating} />
						<Dropdown getPlatform={getPlatform} platform={platform} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditReview;
