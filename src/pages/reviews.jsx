import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Reviews({ getGameID, getID }) {
	const [reviews, setReviews] = useState([]);
	const [isExpanded, setIsExpanded] = useState([]);
	const reviewRef = useRef([]);
	const userIdRef = useRef(sessionStorage.getItem("userId"));
	const [showReadMoreOrLess, setShowReadMoreOrLess] = useState([]);

	console.log(userIdRef.current);

	useEffect(() => {
		axios.get("http://localhost:3001/getmyreviews", { params: { userId: userIdRef.current } }).then((data) => {
			try {
				console.log(data.data);
				setReviews(data.data);
				setShowReadMoreOrLess(
					data.data.map(() => {
						return false;
					})
				);
			} catch (error) {
				console.log(error);
			}
		});
	}, []);

	useEffect(() => {
		if (reviewRef.current[0]) {
			reviewRef.current.forEach((div, i) => {
				if (div?.scrollHeight && div.scrollHeight > 48) {
					setShowReadMoreOrLess((prevState) => {
						let newArray = [...prevState];
						newArray[i] = true;
						return newArray;
					});
				}
			});
		}
	}, [reviews]);

	function expandOrShrink2(index, e) {
		if (isExpanded[index] === true) {
			reviewRef.current[index].classList.add("user-review");
			let isExpandedCopy = isExpanded;
			isExpandedCopy[index] = false;
			setIsExpanded(isExpandedCopy);
			e.target.innerHTML = "Read More";
		} else {
			reviewRef.current[index].classList.remove("user-review");
			let isExpandedCopy = isExpanded;
			isExpandedCopy[index] = true;
			setIsExpanded(isExpandedCopy);
			e.target.innerHTML = "Read Less";
		}
	}

	function deleteReview(reviewID) {
		if (window.confirm("Delete review?")) {
			axios.delete("http://localhost:3001/deleteReview", { params: { reviewID: reviewID } }).then((data) => {
				console.log("status", data.status);
				toast.success("review deleted", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
				axios.get("http://localhost:3001/getmyreviews", { params: { user: userIdRef.current } }).then((data) => {
					try {
						setReviews(data.data);
					} catch (error) {
						console.log(error);
					}
				});
			});
		}
	}

	return (
		<div className="review-card container mb-4 ">
			<h1 className="mb-3 text-white text-center mt-2">My Reviews</h1>
			{reviews.map((review, index) => {
				return (
					<div className="review p-2 mb-2 position-relative rounded" key={review.Review_ID}>
						<div className="review-icons row w-auto m-auto position-absolute top-0 end-0">
							<div className="col px-1 py-2">
								<Link to="/editreview">
									<img
										className="edit-icon bg-secondary rounded-2 px-1"
										src={require("../assets/images/edit-icon3.png")}
										alt="edit"
										onClick={() => getGameID(review.Game_ID[0], getID(review.Review_ID))}
									/>
								</Link>
							</div>
							<div className="col px-1 py-2">
								<img
									className="delete-icon bg-secondary rounded-2 px-1"
									src={require("../assets/images/trashcan2.png")}
									alt="delete"
									onClick={() => deleteReview(review.Review_ID)}
								/>
							</div>
						</div>
						<div className="row w-100 m-auto">
							<h2 className="text-white">{review.Game_Title}</h2>
						</div>
						<div className="row w-100 m-auto">
							<div className="col-2 mh-100 text-center">
								<img className="review-img img-fluid" src={require(`../assets/images/${review.Game_Img}`)} alt="" />
							</div>
							<div className="col text-white p-0 ">
								<div className="user-name row w-100 m-auto">{review.User}</div>
								<div className="platform row mt-2 w-100 m-auto">{review.Platform}</div>
								<div className="row mt-2 justify-content-start w-100 m-auto">
									<div className="rating1 col p-0">
										{[...Array(5)].map((star, i) => {
											return <FaStar color={review.Game_Rating >= i + 1 ? "#ffc107" : "#e4e5e9"} key={i} />;
										})}
									</div>
								</div>
								<div className={"row w-100 m-auto mt-2 rounded" + index}>
									<div className="user-review bg-secondary rounded p-1" ref={(item) => reviewRef.current.push(item)}>
										{review.Game_Review}
									</div>
									{showReadMoreOrLess[index] ? (
										<Link className="text-decoration-none text-center" onClick={(e) => expandOrShrink2(index, e)}>
											Read More
										</Link>
									) : null}
								</div>
								<div className="row w-100 m-auto text-white">
									<div className="col-2">likes</div>
									<div className="col-2">comments</div>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Reviews;
