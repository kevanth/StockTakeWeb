
export default class Item {
  id: number;
	name: string;
	count: number;
  category: string;
  description: string;

  constructor(id:number, name: string, count: number, category: string, description: string){
    this.id = id
    this.name = name
    this.count = count
    this.category = category
    this.description = description
  }
}