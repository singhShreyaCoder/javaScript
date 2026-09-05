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

let arr = [1, 2, 3, 4, 5, 6, 8, 10];
let divisible = arr.filter((num) => num % 2 == 0);
console.log(divisible);

let arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let square = arr2.map((num) => num ** 2);
console.log(square);

let arr = [1, 2, 3, 4];
let factorial = arr.reduce((acc, num) => acc * num);
console.log(factorial);
