import React from "react";
import { Link } from "react-router-dom";

function Navbar({ active, setActive, registerActive, setRegisterActive }) {
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

	return (
		<div className="navbar navbar-expand bg-dark position-relative border-bottom border-secondary">
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
	);
}

export default Navbar;
