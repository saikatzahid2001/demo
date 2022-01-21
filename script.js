const modal = document.querySelector(".create_new_modal");
const createNewBox = document.querySelector(".create_new_box");
const newTitle = document.querySelector("#title");
const newDescription = document.querySelector("#description");

///////////////// Helper Fnctions /////////////////
function closeModal() {
  createNewBox.classList.add("pullUp");
  setTimeout(() => {
    modal.style.display = "none";
    createNewBox.classList.remove("pullUp");
  }, 700);
}
///////////////// Helper Fnctions /////////////////

//// Open Modal ////
document.querySelector(".add_new").addEventListener("click", () => {
  modal.style.display = "flex";
  createNewBox.classList.add("bigEntrance");
  setTimeout(() => {
    createNewBox.classList.remove("bigEntrance");
  }, 1000);
});
//// Open Modal ////

//// Create New Note ////
document.querySelector(".create").addEventListener("click", () => {
  const clonedNodeOfNote = document.querySelector(".note").cloneNode(true);
  clonedNodeOfNote.children[0].children[0].innerHTML = newTitle.value.replace(
    /\r?\n/g,
    "<br>"
  );
  clonedNodeOfNote.children[1].children[0].innerHTML =
    newDescription.value.replace(/\r?\n/g, "<br>");

  const notesContainer = document.querySelector(".notes_grid_item");
  notesContainer.insertBefore(clonedNodeOfNote, notesContainer.children[0]);
  const translateY = clonedNodeOfNote.getBoundingClientRect().height;
  notesContainer.removeChild(notesContainer.children[0]);
  closeModal();
  setTimeout(() => {
    [...notesContainer.children].forEach((c) => {
      c.style.transition = `all 0.5s linear`;
      c.style.transform = `translateY(${translateY + 30}px)`;
    });
    setTimeout(() => {
      notesContainer.style.position = "relative";
      clonedNodeOfNote.style.position = "absolute";
      clonedNodeOfNote.style.top = "0";
      clonedNodeOfNote.style.left = "0";
      notesContainer.insertBefore(clonedNodeOfNote, notesContainer.children[0]);
      notesContainer.children[0].classList.add("pullDown");
      setTimeout(() => {
        notesContainer.removeAttribute("style");
        notesContainer.children[0].removeAttribute("style");
        notesContainer.children[0].classList.remove("pullDown");
        [...notesContainer.children].forEach((c) => {
          c.removeAttribute("style");
        });
      }, 1000);
    }, 500);
  }, 1000);
});
//// Create New Note ////

//// Trash Note ////
function removeLetter(input, startPoint, deleteLength) {
  let value = input.value;
  let valueArr = value.split("");
  valueArr.splice(startPoint, deleteLength);
  let newValue = valueArr.join("");
  input.value = newValue;
  input.focus();
}

function removeText(input, secondInput) {
  const tval = input.value.length;
  const dval = secondInput.value.length;
  const desDelete = Math.ceil(dval / tval);
  const removeTitle = setInterval(() => {
    const tvalup = input.value.length;
    const dvalup = secondInput.value.length;
    if (tvalup === 0 && dvalup === 0) {
      clearInterval(removeTitle);
      closeModal();
    } else {
      if (tvalup !== 0) removeLetter(input, tvalup - 1, 1);
      if (dvalup !== 0)
        removeLetter(secondInput, dvalup - desDelete, desDelete);
    }
  }, 20);
}

document.querySelector(".trash").addEventListener("click", () => {
  removeText(newTitle, newDescription);
});
//// Trash Note ////

//// Close Note on modal body click ////
modal.addEventListener("click", (e) => {
  if (e.target !== createNewBox && !createNewBox.contains(e.target)) {
    closeModal();
  }
});
//// Close Note on modal body click ////
