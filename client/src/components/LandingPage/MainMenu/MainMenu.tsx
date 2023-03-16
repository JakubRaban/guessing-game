import React, {FunctionComponent} from "react";
import {MenuButton} from "../../lib/MenuButton/MenuButton";
import {useNavigate} from "react-router-dom";

export const MainMenu: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <MenuButton onClick={() => navigate('/new-game')}>CREATE A GAME</MenuButton>
      <MenuButton onClick={() => {}}>JOIN A GAME</MenuButton>
    </div>
  );
}
