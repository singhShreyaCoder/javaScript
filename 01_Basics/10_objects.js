// const arr = [1, 2, 3, 4];

// for (let [i, value] of arr.entries()) {
//   console.log(i, value);
// }

//objects
const obj = {
  name: "bubbu",
  age: 21,
  sayHello: function () {
    return "hello";
  },
  career: {},
};
console.log(Object.values(obj));

const obj2 = {
  haircolor: "black",
  religion: "hindu",
  country: "India",
  arr: [1, 2, 3, 4],
  sayBye: function () {
    return "bye";
  },
};

const obj3 = { ...obj, ...obj2 };
// console.log(obj3);
obj2.haircolor = "brown";
console.log(obj2, obj3);
