import type { PersonCard } from "../../models.js";
import { limits } from "../../policy.js";

export function coolNewPeople(people: PersonCard[]) {
  return people.slice(0, limits.newestPeople);
}