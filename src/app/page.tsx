// app/page.tsx
import { google } from "googleapis";
import Form from "./components/Form/Form";

//TODO: add add another product button

export default function Home() {
  return (
    <div className="">
      <h1>Home Page</h1>
      <Form />
    </div>
  );
}
