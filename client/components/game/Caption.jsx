import React from "react";
import clns from "classnames";
import cln from "./Caption.scss";

export const Caption = props => {
  const rootCln = clns(cln.caption, {
    [cln.active]: props.state === "active",
    [cln.together]: props.state === "together",
    [cln.improve]: props.state === "improve",
    [cln.withMod]: props.mod,
    [cln.small]: props.small
  });
  const modCln = clns(cln.mod, {
      [cln.modSmall]: props.small 
  })
  return (
    <div className={rootCln}>
      {props.name}
      {props.mod && <span className={modCln}>{props.mod}</span>}
    </div>
  );
};
