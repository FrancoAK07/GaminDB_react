import React, { useRef } from "react";

function Dropdown({ getPlatform, platform }) {
	const platformRef = useRef("");
	const handleChange = (e) => {
		getPlatform(e.target.value);
	};

	return (
		<div className="dropdown row bg-secondary rounded d-flex px-1 align-content-center justify-content-center">
			<label className="col text-white text-nowrap " htmlFor="platforms">
				Choose Platform :
			</label>
			<select
				className="select col m-auto rounded h-75 text-center p-0"
				name="platforms"
				id="platforms"
				ref={platformRef}
				value={platform}
				onChange={handleChange}>
				<option value=""></option>
				<option value="PS5">PS5</option>
				<option value="PS4">PS4</option>
				<option value="PC">PC</option>
				<option value="Xbox_SX">Xbox_SX</option>
				<option value="Xbox_One">Xbox_One</option>
			</select>
		</div>
	);
}

export default Dropdown;
