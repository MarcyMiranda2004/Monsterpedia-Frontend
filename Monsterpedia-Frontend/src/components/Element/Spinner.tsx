import React from "react";
import "../../style/monsterSpinner.scss";

const MonsterSpinner: React.FC = () => {
  return (
    <div className="monster-spinner me-2">
      <img
        src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1755701691/Energy_Classic_pukmoz.webp"
        alt="Monster_Spinner"
        className=""
      />
    </div>
  );
};

export default MonsterSpinner;
