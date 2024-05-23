import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ active, setActive, registerActive, setRegisterActive }) {
	const hamburgerMenu = useRef(null);
	const hamburgerLinks = useRef(null);
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

	function toggleActive() {
		if (active === false) {
			setActive(true);
		}

		if (active === true) {
			setActive(false);
		}
	}

	function activeRegister() {
		if (registerActive === false) {
			setRegisterActive(true);
		}

		if (registerActive === true) {
			setRegisterActive(false);
		}
	}

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
		<div className="row w-100 m-auto position-relative">
			<div className="navbar navbar-expand bg-dark position-relative border-bottom border-secondary d-none d-sm-flex">
				<div className="me-3 ms-3">
					<Link to="/" className="text-light text-decoration-none">
						Home
					</Link>
				</div>

				<div className="me-3">
					<Link to="/games" className="text-light text-decoration-none">
						Games
					</Link>
				</div>

				<div className="position-absolute end-0 me-3 row ">
					<div className="col">
						<Link onClick={toggleActive} className="login-link text-light text-decoration-none">
							Login
						</Link>
					</div>

					<div className="col">
						<Link onClick={activeRegister} className="login-link text-light text-decoration-none">
							Register
						</Link>
					</div>
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
						<Link onClick={toggleActive} className="login-link text-light text-decoration-none w-auto">
							Login
						</Link>
					</div>
					<div className="col-12 p-1">
						<Link onClick={activeRegister} className="login-link text-light text-decoration-none w-auto">
							Register
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

export default Navbar;
