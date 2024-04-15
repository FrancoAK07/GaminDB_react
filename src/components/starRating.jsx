import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

function StarRating({ getRating, dbRating }) {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        if (dbRating) {
            setRating(dbRating)
        }
    },[dbRating])

  return (
    <div className="text-white text-center">
        <h2>Rating</h2>
        {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
                <label className="rating me-1" key={i}>
                    <input 
                        className="d-none h-100 w-100" 
                        type="radio" value={ratingValue} 
                        onClick={() => {setRating(ratingValue); getRating(ratingValue)}} 
                    />
                    
                    <FaStar 
                        className="star h-100 w-100" 
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                        onMouseEnter={()=> {setHover(ratingValue)}}
                        onMouseLeave={()=> {setHover(null)}}
                    />
                </label>
                ) 
        })}
    </div>
  )
}

export default StarRating