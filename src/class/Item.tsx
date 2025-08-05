
export default class Item {
  id: string;
	name: string;
	count: number;
  category: string;
  description: string;

  constructor(id: string, name: string, count: number, category: string, description: string){
    this.id = id
    this.name = name
    this.count = count
    this.category = category
    this.description = description
  }
}