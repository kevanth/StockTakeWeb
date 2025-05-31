import Item from "./item";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-background" >
      <Item name="tissue" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
    </div>
  );
}
