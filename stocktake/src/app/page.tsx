import Item from "./item";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[10%] bg-background w-[80%] mx-auto mt-10" >
      <Item name="tissue" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
    </div>
  );
}
