const mySet = new Set([1, 2, 3, 4, 5]);
mySet.add(6);
mySet.delete(3);
mySet.has(4);
mySet.size;
console.log(mySet);

const myMap = new Map();
const numberMap = new Map([
  [1, "one"],
  [2, "two"],
]);

myMap.set(4, "four");
myMap.delete(4);
myMap.get(1);

// error handling

try {
  riskeyFunction();
} catch (error) {
  console.error("an error occured:", error.message);
} finally {
  console.log("cleanup code can go here");
}
