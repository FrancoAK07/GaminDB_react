import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar";
import LoginForm from "./components/loginForm";
import Home from "./pages/home/home";
import CreateReview from "./pages/createReview";
import RegisterForm from "./components/registerForm";
import UserNavbar from "./components/userNavbar";
import Reviews from "./pages/reviews";
import Games from "./pages/games";
import EditReview from "./pages/editReview";
import Lists from "./pages/lists";
import List from "./pages/list";
import { Toaster } from "react-hot-toast";

function App() {
	const [active, setActive] = useState(false);
	const [registerActive, setRegisterActive] = useState(false);
	const [userLoggedIn, setUserLoggedIn] = useState(sessionStorage.getItem("logged"));
	const [user, setUser] = useState(sessionStorage.getItem("user"));
	const [reviewID, setReviewID] = useState(null);
	const [gameImg1, setGameImg1] = useState(null);
	const [background1, setBackground] = useState(null);
	const [gameID, setGameID] = useState(null);
	const [userId, setUserId] = useState(sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : null);

	function userName(name) {
		setUser(name);
	}

	function getID(ID) {
		setReviewID(ID);
	}

	function getGameImg(image) {
		setGameImg1(image);
		console.log(image);
	}

	function getBackground(background) {
		setBackground(background);
		console.log(background);
	}

	function getGameID(ID) {
		setGameID(ID);
	}

	function getUserId(userId) {
		setUserId(userId);
	}

	useEffect(() => {
		console.log(userId);
	}, [userId]);

	return (
		<div className="App min-vh-100">
			<Router>
				<Toaster position="top-right" containerStyle={{ top: 50 }} />
				{userLoggedIn ? (
					<UserNavbar user={user} setUserLogged={setUserLoggedIn} className="w-100" />
				) : (
					<Navbar
						className="w-100"
						active={active}
						setActive={setActive}
						registerActive={registerActive}
						setRegisterActive={setRegisterActive}
					/>
				)}
				<LoginForm
					userName={userName}
					userLogged={userLoggedIn}
					setUserLogged={setUserLoggedIn}
					active={active}
					setActive={setActive}
					setRegisterActive={setRegisterActive}
					getUserId={getUserId}
					onClickOutside={() => {
						setActive(false);
					}}
				/>
				<RegisterForm
					registerActive={registerActive}
					setRegisterActive={setRegisterActive}
					setActive={setActive}
					onClickOutside={() => {
						setRegisterActive(false);
					}}
				/>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/createreview" element={<CreateReview gameImg1={gameImg1} background1={background1} gameID={gameID} />} />
					<Route path="/reviews" element={<Reviews getID={getID} getGameID={getGameID} />} />
					<Route path="/lists" element={<Lists />} />
					<Route path="/list" element={<List />} />
					<Route
						path="/games"
						element={<Games getID={getID} getGameImg={getGameImg} getBackground={getBackground} getGameID={getGameID} />}
					/>
					<Route path="/editreview" element={<EditReview reviewID={reviewID} gameID={gameID} />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
