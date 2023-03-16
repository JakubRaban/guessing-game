import React, {FunctionComponent} from "react";

import './MenuButton.scss';

interface Props {
  children: string
  onClick: () => void
}

export const MenuButton: FunctionComponent<Props> = ({ children, onClick }) => {
  return (
    <button className="menu-button" onClick={onClick}>
      {children}
    </button>
  )
}
