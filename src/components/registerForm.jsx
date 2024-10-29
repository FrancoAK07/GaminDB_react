import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function RegisterForm({ registerActive, setRegisterActive, onClickOutside, setActive }) {
	const visible =
		"col-9 col-sm-7 col-md-5 col-lg-3 p-2 login-form bg-dark position-absolute top-50 start-50 translate-middle rounded border border-light";
	const invisible = "register-form-invisible form-control w-25 bg-dark position-absolute";
	const ref = useRef(null);
	const registerNameInput = useRef(null);
	const registerEmailInput = useRef(null);
	const registerPasswordInput = useRef(null);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (registerActive && !ref.current.contains(e.target)) {
				onClickOutside();
				registerNameInput.current.value = "";
				registerEmailInput.current.value = "";
				registerPasswordInput.current.value = "";
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [registerActive, onClickOutside]);

	const registerUser = () => {
		if (!userName || !userEmail || !userPassword) {
			toast.error("please fill all fields", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
		} else if (!userEmail.includes("@")) {
			toast.error("please enter a valid email", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
		} else {
			axios
				.post("https://gamingdbreactserver-production.up.railway.app/insert", {
					userName: userName,
					userEmail: userEmail,
					userPassword: userPassword,
				})
				.then(
					setRegisterActive(false),
					toast.success("registered successfully!", {
						style: { background: "#212529", color: "white", border: "1px solid gray" },
					})
				);
		}
	};

	function loginLink(e) {
		e.preventDefault();
		setRegisterActive(false);
		setActive(true);
	}

	return (
		<form className={registerActive ? visible : invisible} ref={ref}>
			<div className="row w-100 m-auto mb-2">
				<label className="text-white ps-1" htmlFor="register-name-input">
					User Name
				</label>
				<input
					className="form-control"
					type="text"
					id="register-name-input"
					ref={registerNameInput}
					placeholder="Name"
					onChange={(e) => {
						setUserName(e.target.value);
					}}
				/>
			</div>

			<div className="row w-100 m-auto mb-2">
				<label className="text-white ps-1" htmlFor="register-email-input">
					Email Address
				</label>
				<input
					className="form-control"
					type="text"
					id="register-email-input"
					ref={registerEmailInput}
					placeholder="Email"
					onChange={(e) => {
						setUserEmail(e.target.value);
					}}
				/>
			</div>

			<div className="row w-100 m-auto mb-2">
				<label className="text-white ps-1" htmlFor="register-password-input">
					Password
				</label>
				<input
					className="form-control"
					type="text"
					id="register-password-input"
					placeholder="Enter Password"
					ref={registerPasswordInput}
					onChange={(e) => {
						setUserPassword(e.target.value);
					}}
				/>
			</div>

			<div className="row w-100 m-auto justify-content-center">
				<button className="btn btn-secondary w-50 bg-primary" type="button" onClick={registerUser}>
					Register
				</button>
			</div>

			<p className="text-white text-center m-0 p-1">
				Already have an account? Log in here{" "}
				<Link
					className="text-decoration-none"
					onClick={(e) => {
						loginLink(e);
					}}>
					Log in
				</Link>
			</p>
		</form>
	);
}

export default RegisterForm;
