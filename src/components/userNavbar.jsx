import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserNavbar({ user, setUserLogged }) {
	const dropdownRef = useRef(null);
	const userRef = useRef(null);
	const [dropdown, setDropdown] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const clickOutside = (e) => {
			if ((dropdown && !dropdownRef.current.contains(e.target)) || (dropdown && userRef.current.contains(e.target))) {
				setDropdown(false);
			} else if (!dropdown && userRef.current.contains(e.target)) {
				setDropdown(true);
			}
		};
		document.addEventListener("click", clickOutside, true);
		return () => {
			document.removeEventListener("click", clickOutside, true);
		};
	});

	return (
		<div className="navbar navbar-expand bg-dark position-relative border-bottom border-secondary">
			<div className="me-3 ms-3">
				<Link to="/" className="text-light text-decoration-none">
					Home
				</Link>
			</div>

			<div className="me-3">
				<Link to="/games" className="text-light text-decoration-none text-center">
					Games
				</Link>
			</div>

			<div className="me-3">
				<Link to="/reviews" className="text-light text-decoration-none">
					My Reviews
				</Link>
			</div>

			<div className="">
				<Link to="/lists" className="text-light text-decoration-none">
					Lists
				</Link>
			</div>

			<div className="user-div position-absolute end-0 me-3">
				<div className="user text-white me-2" ref={userRef}>
					{user ? user : null}
				</div>
			</div>

			{dropdown === true ? (
				<div
					ref={dropdownRef}
					className="row position-absolute end-0 top-100 d-flex align-content-center justify-content-center text-center m-0 me-2">
					<div className="text-white bg-dark rounded-2">
						<div
							className="sign-out col-12"
							onClick={() => {
								setUserLogged(false);
								sessionStorage.removeItem("logged");
								sessionStorage.removeItem("user");
								sessionStorage.removeItem("userId");
								navigate("/");
								toast("see you soon", {
									icon: "👏",
									style: { background: "#212529", color: "white", border: "1px solid gray" },
									duration: 2000,
								});
							}}>
							sign out
						</div>
						<div className="col-12">settings</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default UserNavbar;
