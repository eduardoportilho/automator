// all comments
let coms = [...document.querySelectorAll(".athing.comtr")];
// remove the ones with 'parent' link
let rootcoms = coms.filter(
  (it) => !it.querySelector(".comhead").textContent.includes("parent")
);
// get the first text node - where company name is usually located
rootcoms
  .filter((it) => it.querySelector(".commtext.c00"))
  .map((it) => it.querySelector(".commtext.c00").firstChild.textContent);

// 1 liner
// let hiring = [...document.querySelectorAll(".athing.comtr")]
//   .filter((it) => !it.querySelector(".comhead").textContent.includes("parent"))
//   .filter((it) => it.querySelector(".commtext"))
//   .map((it) => it.querySelector(".commtext").firstChild.textContent)
//   .filter((str) => /remote/i.test(str));

// 1 liner (2)
let hiring = [...document.querySelectorAll(".athing.comtr")]
  .filter((it) => !it.querySelector(".comhead").textContent.includes("parent"))
  .filter((it) => it.querySelector(".commtext"))
  .map((it) => it.querySelector(".commtext").innerText.split("\n")[0])
  .filter((str) => /remote/i.test(str));
