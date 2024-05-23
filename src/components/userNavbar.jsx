import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserNavbar({ user, setUserLogged }) {
	const dropdownRef = useRef(null);
	const userRef = useRef(null);
	const hamburgerUserRef = useRef(null);
	const [dropdown, setDropdown] = useState(false);
	const navigate = useNavigate();
	const hamburgerMenu = useRef(null);
	const hamburgerLinks = useRef(null);
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

	useEffect(() => {
		const clickOutside = (e) => {
			if ((dropdown && !dropdownRef.current.contains(e.target)) || (dropdown && userRef.current.contains(e.target))) {
				setDropdown(false);
			} else if (
				(!dropdown && userRef.current.contains(e.target)) ||
				(!dropdown && hamburgerUserRef.current.contains(e.target))
			) {
				setDropdown(true);
			}
		};
		document.addEventListener("click", clickOutside, true);
		return () => {
			document.removeEventListener("click", clickOutside, true);
		};
	});

	function hamburgerMenuClicked() {
		hamburgerMenu.current.classList.toggle("hamburgerActive");
		let expandHamburgerMenu = !showHamburgerMenu;
		setShowHamburgerMenu(expandHamburgerMenu);
	}

	useEffect(() => {
		const closeHamburgerMenu = (e) => {
			if (showHamburgerMenu) {
				if (!hamburgerMenu.current.contains(e.target) && !hamburgerLinks.current.contains(e.target)) {
					hamburgerMenu.current.classList.remove("hamburgerActive");
					setShowHamburgerMenu(false);
				}
			}
		};
		document.addEventListener("click", closeHamburgerMenu, true);
		return () => {
			document.removeEventListener("click", closeHamburgerMenu, true);
		};
	}, [showHamburgerMenu]);

	return (
		<div className="row w-100 m-auto position-relative border-bottom border-secondary">
			<div className="navbar navbar-expand bg-dark position-relative d-none d-sm-flex">
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

				<div className="user-div position-absolute end-0 top-50 translate-middle-y me-3 w-auto">
					<div className="user text-white me-2" ref={userRef}>
						{user ? user : null}
					</div>
				</div>
			</div>
			<div className="user-div position-absolute end-0 top-50 translate-middle-y me-3 w-auto">
				<div className="user text-white me-2" ref={hamburgerUserRef}>
					{user ? user : null}
				</div>
			</div>
			<div className="hamburger-menu m-auto d-sm-none p-1 w-auto" ref={hamburgerMenu} onClick={hamburgerMenuClicked}>
				<div className="bar"></div>
				<div className="bar"></div>
				<div className="bar"></div>
			</div>
			{showHamburgerMenu && (
				<div
					className="hamburger-links position-absolute top-100 bg-dark row w-100 m-auto text-center py-2 border-top border-bottom border-light"
					ref={hamburgerLinks}>
					<div className="col-12 p-1">
						<Link to="/" className="text-light text-decoration-none w-auto">
							Home
						</Link>
					</div>
					<div className="col-12 p-1">
						<Link to="/games" className="text-light text-decoration-none w-auto">
							Games
						</Link>
					</div>
					<div className="col-12 p-1">
						<Link to="/reviews" className="text-light text-decoration-none">
							My Reviews
						</Link>
					</div>
					<div className="col-12 p-1">
						<Link to="/lists" className="text-light text-decoration-none">
							Lists
						</Link>
					</div>
				</div>
			)}
			{dropdown === true ? (
				<div
					ref={dropdownRef}
					className="row w-auto position-absolute end-0 top-100 d-flex align-content-center justify-content-center text-center m-0 mt-1 me-2 z-1">
					<div className="text-white bg-dark rounded-2 p-2 border border-secondary">
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
