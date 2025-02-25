import React, { useState } from "react";
import { Components } from "remoteApp/Components";

const Rating = () => {
  const [ratingValue, setRatingValue] = useState(1);

  return (
    <div>
      <Components.Input.InputField
        id={"rating"}
        name={"rating"}
        label={"Rating"}
        value={ratingValue}
        type={"number"}
        onChange={(e) => setRatingValue(e.target.value)}
      />
      <Components.Ratings value={ratingValue} />
    </div>
  );
};

export default Rating;
