import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Card } from "../client/components/game/Card";

// TS
// type State = "active" | "together" | "improve"
/* 
interface Caption = {
    name: string;
    mod?: string;
    state?: State;
}
*/
const captions = [
  {
    name: "Большой",
    mod: "+1"
  },
  {
    name: "Камуфляж"
  },
  {
    name: "Хищник",
    mod: "+1"
  },
  {
    name: "Сотрудничество",
    state: "together"
  },
  {
    name: "Камуфляж",
    state: "active"
  },
  {
    name: "Симбионт",
    state: "improve"
  },
  {
    name: "Лазающее"
  },
  {
    name: "Лазающее"
  },
  {
    name: "Лазающее"
  },
  {
    name: "Лазающее"
  }
];

storiesOf("Button", module)
  .add("card", () => (
    <div style={{
        display: "flex",
        marginTop: 50,
        marginLeft: 50,
        alignItems: "flex-start"
    }}>
      <Card feed={0} capacity={1} captions={captions.slice(0, 1)} />
      <Card feed={1} capacity={3} hasFat captions={captions} />
      <Card feed={1} capacity={2} hasFat captions={captions.slice(0, 5)} />
      <Card feed={2} capacity={2} captions={captions.slice(0, 8)} />
    </div>
  ))
  .add("with some emoji", () => <span>Bye</span>);
