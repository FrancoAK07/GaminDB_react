import React, { useRef } from "react";

function Dropdown({ getPlatform, platform }) {
	const platformRef = useRef("");
	const handleChange = (e) => {
		getPlatform(e.target.value);
	};

	return (
		<div className="dropdown row bg-secondary rounded align-content-center px-1">
			<label className="col-12 col-md text-white text-nowrap text-center p-0 px-1" htmlFor="platforms">
				Choose Platform :
			</label>
			<select
				className="select col-12 col-md m-auto rounded text-center p-0"
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
