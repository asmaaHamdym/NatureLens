import Link from "next/link";
export default async function Posts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {});
  const posts = await res.json();
  return (
    <div className="text-center">
      <h1>Welcome to my posts page</h1>
      {posts.map((post: { id: number; title: string }) => (
        <div key={post.id} className="m-4 p-4 border rounded">
          <Link href={`posts/${post.id}`}>{post.title}</Link>
        </div>
      ))}
    </div>
  );
}
