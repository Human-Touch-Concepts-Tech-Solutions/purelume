// src/app/page.js
import styles from "./page.module.css";
import Navbar from "@/components/Navigation/Navigation";
import Banner from "@/components/Banner/Banner";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Banner />
      </main>
    </div>
  );
}