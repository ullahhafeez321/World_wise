import Logo from "./Logo";
import AppNav from "../components/AppNav";
import styles from "./Sidebar.module.css";
import Footer from "./Footer";
import { Outlet } from "react-router";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </div>
  );
}
