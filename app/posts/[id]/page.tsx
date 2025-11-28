import { notFound } from "next/navigation";
export default async function page({ params }: { params: { id: string } }) {
  const id = (await params).id;
  const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  if (!data.ok) {
    return notFound();
  }

  const post = await data.json();
  if (!post || !post.id) {
    return notFound();
  }
  return (
    <div>
      <h1 className="text-center text-2xl">{post.title}</h1>
      <p className="text-center text-red">{post.body}</p>
    </div>
  );
}
