import React, {FunctionComponent} from "react";
import cx from "classnames";

import './Header.scss'

interface Props {
  className?: string;
}

export const Header: FunctionComponent<Props> = ({ className, children }) => (
  <h1 className={cx('header', className)}>{children}</h1>
);
