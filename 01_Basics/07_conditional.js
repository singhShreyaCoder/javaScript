// let age = 55;

// if (age <= 0 || age >= 120) {
//   console.log("Chal nikal");
// } else if (age > 18) {
//   console.log("bada hoja pehle");
// } else if (age <= 18) {
//   console.log("papa bola kar");
// } else {
//   console.log("........");
// }

let age = 20;
if (age < 18) {
  console.log("you cannot drive");
} else {
  console.log("you can drive");
}

// ternary operator (?)
age > 18 ? console.log("good") : "bad";

const arr = [2, 3, 4, 5];
console.log(arr);
const arr2 = Array.from("hello");
console.log(arr2);

arr2[2] = "g";
console.log(arr2);
arr2.pop();
console.log(arr2);
arr2.shift();
arr2.unshift("bye");
console.log(arr2);
console.log(arr2.indexOf(arr2));
const arr3 = arr.splice(1);
console.log(arr3);
