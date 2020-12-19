const cardMaker = (title, name, text, image, options) => {
  const cardDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const h3 = document.createElement("h3");
  const label = document.createElement("label");

  h3.innerText = `${title}`;
  h3.classList.add("card");

  imgDiv.style.background = `${url(image)}`;
  imgDiv.classList.add("img");

  for (let option of options) {
    label.innerHTML = `<input type="radio" name=${name} />${option}`;
  }

  cardDiv.appendChild(imgDiv);
  cardDiv.appendChild(h3);
  cardDiv.appendChild(label);
  document.querySelector(".container").appendChild(cardDiv);
};
