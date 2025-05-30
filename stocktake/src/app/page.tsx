import Item from "./item";

export default function Home() {
  return (
    <div className="flex" >
      <Item name="tissue" initialCount={1}></Item>
      <Item name="abc" initialCount={1}></Item>
    </div>
    
  );
}
