import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function ReviewCard() {
	const [reviews, setReviews] = useState([]);
	const [isExpanded, setIsExpanded] = useState([]);
	const reviewRef = useRef([]);
	const [showReadMoreOrLess, setShowReadMoreOrLess] = useState([]);

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

	useEffect(() => {
		console.log("reviewcard useEffect");
		axios.get("http://localhost:3001/getlastreviews").then((data) => {
			console.log(data.data);
			setReviews(data.data);
			setShowReadMoreOrLess(
				data.data.map(() => {
					return false;
				})
			);
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

	return (
		<div className="review-card container">
			{reviews.map((review, index) => {
				return (
					<div className="p-1 mb-2 rounded border border-secondary" key={review.Review_ID}>
						<div className="row w-100 m-auto">
							<h2 className="text-white">{review.Game_Title}</h2>
						</div>
						<div className="row w-100 m-auto">
							<div className="col-2 mh-100 text-center p-2">
								<img className="review-img img-fluid" src={require(`../../assets/images/${review.Game_Img}`)} alt="" />
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

export default ReviewCard;
