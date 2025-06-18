
export default class Item {
  id: number;
	name: string;
	count: number;

  constructor(id:number, name: string, initialCount: number){
    this.id = id
    this.name = name
    this.count = initialCount
  }
}