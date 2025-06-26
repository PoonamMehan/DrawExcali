import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Link from "next/link";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
      <Link href="/login">
        <button>Sign In</button>
      </Link>
    </div>
  );
}
