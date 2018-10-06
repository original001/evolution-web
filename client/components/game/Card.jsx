import React from "react";
import cln from "./Card.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import clns from "classnames";
import { Caption } from "./Caption";

export class Card extends React.Component {
  render() {
    const { capacity, feed, hasFat, captions } = this.props;
    const small = captions.length > 9;
    const rootCln = clns(cln.root, {
      [cln.needImg]: captions.length === 0
    })
    return (
      <div className={rootCln}>
        <div className={cln.food}>
          {Array(feed)
            .fill()
            .map((_, i) => (
              <FontAwesomeIcon
                key={`feed-${i}`}
                icon={faLeaf}
                className={clns(cln.foodItem, cln.full)}
              />
            ))}
          {Array(capacity - feed)
            .fill()
            .map((_, i) => (
              <FontAwesomeIcon
                key={`total-${i}`}
                icon={faLeaf}
                className={cln.foodItem}
              />
            ))}
          {hasFat && (
            <FontAwesomeIcon
              icon={faLeaf}
              className={clns(cln.foodItem, cln.fat)}
            />
          )}
        </div>
        <div className={cln.bottom}>
          {captions.map(({ name, mod, state }, i) => (
            <Caption name={name} mod={mod} state={state} small={small} />
          ))}
        </div>
      </div>
    );
  }
}
