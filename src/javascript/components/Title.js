//IMPORTS


// EXAMPLE
class Title {

  constructor() {

  }

  createTitle(content) {
    let div = document.createElement("div");
    div.innerHTML = content;
    div.style.position = "absolute";
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.transform = "translate(-50%, -50%)"
    document.body.appendChild(div);
  }


}

export default new Title();
