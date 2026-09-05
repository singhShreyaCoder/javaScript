let arr = [1, 2, 3, 4, 5, 6, 8, 10];
let divisible = arr.filter((num) => num % 2 == 0);
console.log(divisible);

let arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let square = arr2.map((num) => num ** 2);
console.log(square);

let arr = [1, 2, 3, 4];
let factorial = arr.reduce((acc, num) => acc * num);
console.log(factorial);
