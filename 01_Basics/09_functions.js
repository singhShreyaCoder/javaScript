function greet(name = shreya, age = 21) {
  console.log(name);
}

const greet = function (name) {};

const greet = (name) => {};

//map filter and reduce
const number = [1, 2, 3, 4];
const doubled = number.map((num) => num * 2);
console.log(doubled);

const user = [
  { name: "shreya", age: 21 },
  { name: "surbhi", age: 24 },
];

const names = user.map((user) => user.name);
console.log(names);

const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);

const no = [2, 3, 4, 5];
const evenNumbers = no.filter((num) => num % 2 === 0);
console.log(evenNumbers);

// this keyword
const person = {
  name: "shreya",
  greet() {
    console.log(`hello my name is ${this.name}`);
  },
};

person.greet();
