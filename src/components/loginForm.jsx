import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function LoginForm({ active, setActive, onClickOutside, setUserLogged, setRegisterActive, userName, getUserId }) {
	const visible =
		"col-9 col-sm-7 col-md-5 col-lg-3 p-2 login-form bg-dark position-absolute top-50 start-50 translate-middle rounded border border-light";
	const invisible = "login-form-invisible form-control w-25 bg-dark position-absolute";
	const formRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (active && !formRef.current.contains(e.target)) {
				onClickOutside();
				emailRef.current.value = "";
				passwordRef.current.value = "";
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [onClickOutside, active]);

	const logIn = async () => {
		const data = await axios.get("https://gamingdbreactserver-production.up.railway.app/get");
		for (let i = 0; i < data.data.length; i++) {
			if (emailRef.current.value === data.data[i].Email && passwordRef.current.value === data.data[i].Password) {
				sessionStorage.setItem("userId", data.data[i].User_Id);
				userName(data.data[i].User_Name);
				getUserId(data.data[i].User_Id);
				setUserLogged(true);
				setActive(false);
				sessionStorage.setItem("logged", true);
				sessionStorage.setItem("user", data.data[i].User_Name);
				toast.success(`Logged in successfully!\n Hi ${sessionStorage.getItem("user")}!`, {
					style: { background: "#212529", color: "white", border: "1px solid gray" },
				});
				break;
			} else if (i >= data.data.length - 1) {
				toast.error("wrong email or password", { style: { background: "#212529", color: "white", border: "1px solid gray" } });
			}
		}
	};

	function registerLink(e) {
		e.preventDefault();
		setActive(false);
		setRegisterActive(true);
	}

	return (
		<div className="row">
			<form className={active ? visible : invisible} ref={formRef}>
				<div className="row w-100 m-auto mb-2">
					<label className="text-white ps-1" htmlFor="login-email-input">
						Email Address
					</label>
					<input className="form-control" type="text" id="login-email-input" placeholder="Email" ref={emailRef} />
				</div>
				<div className="row w-100 m-auto mb-2">
					<label className="text-white ps-1" htmlFor="login-password-input">
						Password
					</label>
					<input
						className="form-control"
						type="password"
						id="login-password-input"
						placeholder="Enter Password"
						ref={passwordRef}
					/>
				</div>
				<div className="row w-100 m-auto justify-content-center">
					<button type="button" className="btn btn-secondary w-50 bg-primary" onClick={logIn}>
						Log In
					</button>
				</div>
				<p className="text-white text-center m-0 p-1">
					Don't have an account? Register here
					<Link
						className="text-decoration-none ms-1"
						onClick={(e) => {
							registerLink(e);
						}}>
						Register
					</Link>
				</p>
			</form>
		</div>
	);
}

export default LoginForm;
