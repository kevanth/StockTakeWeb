export default class Box {
  id: string;
  name: string;
  owner_id: string;

  constructor(id: string, name: string, owner_id: string) {
    this.id = id;
    this.name = name;
    this.owner_id = owner_id;
  }
}
