/* Documentation: 

// all comments
let coms = [...document.querySelectorAll(".athing.comtr")];

// remove replies - the ones with 'parent' link
let rootcoms = coms.filter(
  (it) => !it.querySelector(".comhead").textContent.includes("parent")
);

// get the first text node (i.e. first row) - where company name is usually located
rootcoms
  .filter((it) => it.querySelector(".commtext.c00"))
  .map((it) => it.querySelector(".commtext.c00").firstChild.textContent);

*/

(() => {
  const WHERE_REGEXS = [/remote/, /full.?time/, /hybrid/, /on.?site/];
  const URL_REGEX = /^https?:\/\//;

  // all headers
  let headers = [...document.querySelectorAll(".athing.comtr")] // all comments
    .filter(
      (it) => !it.querySelector(".comhead").textContent.includes("parent")
    ) // remove the ones with 'parent' link
    .filter((it) => it.querySelector(".commtext")) // keep only the ones with a text node
    .map((it) => it.querySelector(".commtext").innerText.split("\n")[0]); // get the first line of the text node
  // .filter((str) => /remote/i.test(str)); // uncomment to keep only the ones with "remote"

  // Copy result to clipboard (`copy` is devtools API)
  copy(headers.join("\n"));
})();
