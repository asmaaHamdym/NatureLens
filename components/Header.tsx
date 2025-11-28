import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div>
      <Link href="/">
        {/* <Image
          src="/app/assets/34740580.jpg"
          alt="Logo"
          width={50}
          height={50}
        /> */}
      </Link>
      <ul className="flex gap-8 flex-row items-center p-4 border-b">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/posts">Posts</Link>
        </li>
      </ul>
    </div>
  );
}
