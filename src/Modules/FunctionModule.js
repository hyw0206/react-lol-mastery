// Champion code -> Champion Name 변환
import championData from '../data/champion.json';
const champions = Object.values(championData);
export function findChampion(key) {
  let cnt = 0;
  for (let i = 0; i < champions.length; i++) {
    if (key.toString() === champions[i].key) {
      cnt = 1;
      return champions[i].name;
    }
    if (cnt === 1) break;
  }
}