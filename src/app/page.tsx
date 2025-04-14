import Header from "./components/Header/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />
      <Link href="/hoyacalculator"> Hoya Pricing Tool</Link>
    </div>
  );
}
