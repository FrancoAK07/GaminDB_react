import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

function ReviewCard() {
	const [reviews, setReviews] = useState([]);
	const [isExpanded, setIsExpanded] = useState([]);
	const reviewRef = useRef([]);
	const commentRef = useRef([]);
	const [showReadMoreOrLess, setShowReadMoreOrLess] = useState([]);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);
	const userId = sessionStorage.getItem("userId");
	let reviewsLikes = [];
	let reviewsComments = [];
	const [showComments, setShowComments] = useState([]);
	const userLogged = sessionStorage.getItem("logged");

	useEffect(() => {
		axios.get("https://gamingdbreactserver-production.up.railway.app/getlikes").then((data) => {
			setLikes(data.data);
			console.log(data.data);
		});
	}, []);

	useEffect(() => {
		axios.get("https://gamingdbreactserver-production.up.railway.app/getcomments").then((data) => {
			setComments(data.data);
			console.log(data.data);
		});
	}, []);

	useEffect(() => {
		console.log("reviewcard useEffect");
		axios.get("https://gamingdbreactserver-production.up.railway.app/getlastreviews").then((data) => {
			console.log(data.data);
			setReviews(data.data);
			setShowReadMoreOrLess(
				data.data.map(() => {
					return false;
				})
			);
			setShowComments(
				data.data.map(() => {
					return false;
				})
			);
		});
	}, []);

	useEffect(() => {
		if (reviewRef.current[0]) {
			reviewRef.current.forEach((div, i) => {
				if (div?.scrollHeight > 56) {
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

	function saveLike(userId, reviewId) {
		if (userId) {
			if (likes.length) {
				let alreadyLiked = likes.find((like) => {
					return parseInt(like.User_Id) === parseInt(userId) && parseInt(like.Review_Id) === parseInt(reviewId);
				});
				if (alreadyLiked) {
					axios
						.delete("https://gamingdbreactserver-production.up.railway.app/deletelike", {
							params: { userId: userId, reviewId: reviewId },
						})
						.then((data) => {
							console.log(data.data);
							console.log("delete");
							axios.get("https://gamingdbreactserver-production.up.railway.app/getlikes").then((data) => {
								setLikes(data.data);
								console.log(data.data);
								return;
							});
						});
				} else {
					axios
						.post("https://gamingdbreactserver-production.up.railway.app/savelike", { userId: userId, reviewId: reviewId })
						.then((data) => {
							console.log(data.data);
							console.log("alreadyLiked not true");
							axios.get("https://gamingdbreactserver-production.up.railway.app/getlikes").then((data) => {
								setLikes(data.data);
								console.log(data.data);
							});
						});
				}
			} else {
				console.log("no length");
				axios
					.post("https://gamingdbreactserver-production.up.railway.app/savelike", { userId: userId, reviewId: reviewId })
					.then((data) => {
						console.log(data.data);
						axios.get("https://gamingdbreactserver-production.up.railway.app/getlikes").then((data) => {
							setLikes(data.data);
							console.log(data.data);
						});
					});
			}
		} else {
			toast("Sign in to like a review", {
				style: { background: "#212529", color: "white", border: "1px solid gray" },
				duration: 2000,
			});
		}
	}

	const countLikes = (review, index) => {
		let likeCount = 0;
		for (let like of likes) {
			if (parseInt(review.Review_ID) === parseInt(like.Review_Id)) {
				likeCount += 1;
			}
		}
		reviewsLikes[index] = likeCount;
	};

	function checkIfLiked(review, index) {
		for (let like of likes) {
			if (parseInt(like.User_Id) === parseInt(userId) && parseInt(like.Review_Id) === parseInt(review.Review_ID)) {
				return (
					<div className="d-flex align-items-center bg-secondary p-1 rounded-2">
						{reviewsLikes[index]}
						<img className="ms-2 text-center" src={require(`../../assets/images/heart2.png`)} alt="" />
					</div>
				);
			}
		}
		return (
			<div className="d-flex align-items-center bg-secondary p-1 rounded-2">
				{reviewsLikes[index]}
				<img className="ms-2 text-center" src={require(`../../assets/images/heart3.png`)} alt="" />
			</div>
		);
	}

	const countComments = (review, index) => {
		let commentCount = 0;
		for (let comment of comments) {
			if (parseInt(comment.Review_Id) === parseInt(review.Review_ID)) {
				commentCount += 1;
			}
		}
		reviewsComments[index] = commentCount;
		console.log(reviewsComments);
	};

	const expandComments = (index) => {
		if (userLogged) {
			let showCommentsCopy = showComments;
			showCommentsCopy.forEach((item, i) => {
				console.log(index);
				console.log(i);
				if (index === i) {
					console.log("index = i");
					showCommentsCopy[index] = !showCommentsCopy[index];
				} else {
					console.log("index != i");
					showCommentsCopy[i] = false;
				}
			});
			setShowComments([...showCommentsCopy]);
		} else {
			toast("Sign in to add a comment", {
				style: { background: "#212529", color: "white", border: "1px solid gray" },
				duration: 2000,
			});
		}
	};

	const checkCommentRef = (item, index) => {
		if (item && showComments[index]) {
			commentRef.current.push(item);
			console.log(commentRef.current);
		} else {
			commentRef.current = [];
			console.log("empty commentRef", commentRef.current);
		}
	};

	function displayComment(review) {
		let matchingComments = [];
		for (let comment of comments) {
			if (parseInt(review.Review_ID) === parseInt(comment.Review_Id)) {
				matchingComments.push(
					<div className="col-12 p-2 border border-1 border-secondary rounded-2 mb-2 text-white">
						<div className="row w-100 m-auto">{comment.User_Name}</div>
						<div className="row w-100 m-auto ms-2">{comment.Comment}</div>
					</div>
				);
			}
		}
		return matchingComments;
	}

	const saveComment = (review) => {
		console.log(review.Review_ID);
		if (commentRef.current[0].value) {
			axios
				.post("https://gamingdbreactserver-production.up.railway.app/savecomment", {
					userId: userId,
					comment: commentRef.current[0].value,
					reviewId: review.Review_ID,
				})
				.then((data) => {
					commentRef.current[0].value = "";
					console.log(data.data);
					toast("Comment Added!!", {
						style: { background: "#212529", color: "white", border: "1px solid gray" },
						duration: 2000,
					});
					axios.get("https://gamingdbreactserver-production.up.railway.app/getcomments").then((data) => {
						setComments(data.data);
						console.log(data.data);
					});
				});
		} else {
			toast("Can't add empty comment", {
				style: { background: "#212529", color: "white", border: "1px solid gray" },
				duration: 2000,
			});
		}
	};

	return (
		<div className="review-card container">
			{reviews.map((review, index) => {
				return (
					<div className="p-2 mb-4 rounded border border-secondary" key={review.Review_ID}>
						<div className="row w-100 m-auto">
							<h2 className="text-white">{review.Game_Title}</h2>
						</div>
						<div className="row w-100 m-auto">
							<div className="col-8 col-lg-2 mh-100 text-center p-2 mx-auto">
								<img className="img-fluid" src={require(`../../assets/images/${review.Game_Img}`)} alt="" />
							</div>
							<div className="col-12 col-lg text-white p-0">
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
									<div className="user-review border border-secondary rounded p-2" ref={(item) => reviewRef.current.push(item)}>
										{review.Game_Review}
									</div>
									{showReadMoreOrLess[index] ? (
										<Link className="text-decoration-none text-center" onClick={(e) => expandOrShrink2(index, e)}>
											Read More
										</Link>
									) : null}
								</div>
								{countLikes(review, index)}
								{countComments(review, index)}
								<div className="row w-100 m-auto text-white mt-2">
									<div className="col-2">
										<button
											className="like-btn btn rounded text-white border-0"
											onClick={() => {
												saveLike(userId, review.Review_ID);
											}}>
											{checkIfLiked(review, index)}
										</button>
									</div>
									<div className="col-2 ms-3">
										<button
											className="comment-btn btn rounded text-white border-0"
											onClick={() => {
												expandComments(index);
												console.log(showComments);
											}}>
											<div className="d-flex align-items-center bg-secondary p-1 rounded-2">
												{reviewsComments[index]}
												<img className="ms-2 text-center" src={require(`../../assets/images/comments.png`)} alt="" />
											</div>
										</button>
									</div>
								</div>
							</div>
							{showComments[index] && (
								<div className="row w-100 m-auto rounded-2 p-2">
									<div>
										<textarea
											className="mt-2 w-100 p-1"
											name="comment"
											id="comment"
											rows="3"
											cols="5"
											ref={(item) => checkCommentRef(item, index)}
											placeholder="Your comment here..."></textarea>
										<button className="d-block btn btn-primary mb-4" onClick={() => saveComment(review)}>
											Save Comment
										</button>
									</div>
									{displayComment(review)}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default ReviewCard;
