const modal = document.querySelector(".create_new_modal");
const createNewBox = document.querySelector(".create_new_box");
const newTitle = document.querySelector("#title");
const newDescription = document.querySelector("#description");
const newCreate = document.querySelector(".create");
const newChooseColor = document.querySelector(".new_choose");
const newChooseColorTrigger = document.querySelector(".new_choose_color");
const newChooseColorDropdown = document.querySelector(".new_colors");

const notesColumns = document.querySelectorAll(".notes_grid_item");

///////////////// Helper Fnctions /////////////////
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function changeNoteContainer(d, dIndex) {
  const container = [...d.parentNode.children];
  for (let i = dIndex + 1; i < container.length; i++) {
    const current = container[i];
    current.style = `--tStart:${
      d.getBoundingClientRect().height + 30
    }px; --tEnd:0px`;
    current.classList.add("transformFromTo");
    setTimeout(() => {
      current.removeAttribute("style");
      current.classList.remove("transformFromTo");
    }, 150);
  }
}

function closeModal() {
  createNewBox.classList.add("pullUp");
  newCreate.disabled = true;
  setTimeout(() => {
    modal.style.display = "none";
    createNewBox.classList.remove("pullUp");
    newCreate.disabled = false;
  }, 700);
}

function closeNewChooseDropdown() {
  newChooseColorDropdown.classList.add("pullUpChoose");
  setTimeout(() => {
    newChooseColorDropdown.style.display = "none";
    newChooseColorDropdown.classList.remove("pullUpChoose");
    newChooseColorTrigger.classList.remove("show");
  }, 380);
}

function changeColor() {
  const trigger_btn_color =
    this.parentNode.parentNode.previousElementSibling.children[1];
  const container = this.parentNode.parentNode.parentNode.parentNode.parentNode;
  trigger_btn_color.classList.remove(trigger_btn_color.classList[1]);
  trigger_btn_color.classList.add(this.classList[1]);
  container.classList.remove(container.classList[1]);
  container.classList.add(this.classList[1]);
  closeColorsDropDown(
    this.parentNode.parentNode,
    this.parentNode.parentNode.parentNode.children[0]
  );
}

function openColorsDropDown(dropdown) {
  dropdown.style.display = "block";
  dropdown.classList.add("pullDownChoose");
  setTimeout(() => {
    dropdown.classList.remove("pullDownChoose");
  }, 1000);
}

function closeColorsDropDown(dropdown, trigger) {
  dropdown.classList.add("pullUpChoose");
  setTimeout(() => {
    dropdown.style.display = "none";
    dropdown.classList.remove("pullUpChoose");
    trigger.classList.remove("show");
  }, 380);
}

function colorsDropDownTrigger() {
  if (!this.classList.contains("show")) {
    this.classList.add("show");
    openColorsDropDown(this.nextElementSibling);
  } else {
    closeColorsDropDown(this.nextElementSibling, this);
  }
}

function removeNote() {
  this.parentNode.classList.add("closeTriggered");
  this.parentNode.classList.add("pullUp");
  setTimeout(() => {
    this.parentNode.parentNode.removeChild(this.parentNode);
  }, 700);
}

function editCurrentNoteTrigger() {
  this.parentNode.parentNode.setAttribute("id", "editing");
  newTitle.value =
    this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.children[0].innerHTML.replace(
      /\r?<br>/g,
      "\n"
    );
  newDescription.value =
    this.parentNode.previousElementSibling.previousElementSibling.children[0].innerHTML.replace(
      /\r?<br>/g,
      "\n"
    );
  modal.style.display = "flex";
  createNewBox.setAttribute("data-mode", "edit");
  createNewBox.classList.remove(createNewBox.classList[1]);
  createNewBox.classList.add(this.parentNode.parentNode.classList[1]);
  newChooseColorTrigger.children[1].classList.remove(
    newChooseColorTrigger.children[1].classList[1]
  );
  newChooseColorTrigger.children[1].classList.add(
    this.parentNode.parentNode.classList[1]
  );
  createNewBox.classList.add("bigEntrance");
  setTimeout(() => {
    createNewBox.classList.remove("bigEntrance");
  }, 1000);
}

function editCurrentNote() {
  if (newTitle.value.length === 0) {
    return alert("You can't leave Title field empty!");
  }
  const editingNote = document.querySelector("#editing");
  editingNote.removeAttribute("id");
  createNewBox.removeAttribute("data-mode");
  editingNote.children[0].children[0].innerHTML = newTitle.value.replace(
    /\r?\n/g,
    "<br/>"
  );
  editingNote.children[1].children[0].innerHTML = newDescription.value.replace(
    /\r?\n/g,
    "<br/>"
  );
  editingNote.classList.remove(editingNote.classList[1]);
  editingNote.classList.add(createNewBox.classList[1]);
  const chooseColorTrigger =
    editingNote.children[3].children[1].children[0].children[1];
  chooseColorTrigger.classList.remove(chooseColorTrigger.classList[1]);
  chooseColorTrigger.classList.add(createNewBox.classList[1]);
  closeModal();
  setTimeout(() => {
    newTitle.value = "";
    newDescription.value = "";
  }, 700);
}

function createNote() {
  if (newTitle.value.length === 0) {
    return alert("You can't leave Title field empty!");
  }
  const data = {
    color: createNewBox.classList[1],
    title: newTitle.value,
    description: newDescription.value,
  };
  const clonedNodeOfNote = createNoteNode(data);

  const notesContainer = notesColumns[0];
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
      newTitle.value = "";
      newDescription.value = "";
      setTimeout(() => {
        [...notesContainer.children].forEach((c) => {
          c.removeAttribute("style");
        });
        notesContainer.removeAttribute("style");
        notesContainer.children[0].removeAttribute("style");
        notesContainer.children[0].classList.remove("pullDown");
        initializeDragAndDrop(notesContainer.children[0]);
      }, 1000);
    }, 500);
  }, 1000);
}

function createNoteNode(data) {
  let div_container = document.createElement("div");
  div_container.classList.add("note");
  div_container.classList.add(data.color);
  div_container.innerHTML = `
    <div class="note_title"><h2>${data.title.replace(/\r?\n/g, "<br/>")}</div>
    <div class="note_description">
      <p>${data.description.replace(/\r?\n/g, "<br/>")}</p>
    </div>
  `;

  let note_close_btn = document.createElement("div");
  note_close_btn.classList.add("note_delete");
  note_close_btn.innerHTML = `<i class="fas fa-times"></i>`;
  div_container.appendChild(note_close_btn);
  note_close_btn.addEventListener("click", removeNote);

  let div_color_container = document.createElement("div");
  div_color_container.classList.add("note_color_change");

  let edit_btn = document.createElement("button");
  edit_btn.classList.add("note_edit");
  edit_btn.innerHTML = '<i class="far fa-edit"></i>';
  div_color_container.appendChild(edit_btn);
  edit_btn.addEventListener("click", editCurrentNoteTrigger);

  let div_color_inner = document.createElement("div");
  div_color_inner.classList.add("choose_colors_container");
  let colors_dropdown_trigger = document.createElement("button");
  colors_dropdown_trigger.classList.add("choose_color");
  colors_dropdown_trigger.innerHTML = `
    <span class="icon"><i class="fas fa-chevron-down"></i></span>
    <span class="color_box ${data.color}"></span>
  `;
  div_color_inner.appendChild(colors_dropdown_trigger);
  colors_dropdown_trigger.addEventListener("click", colorsDropDownTrigger);

  let colors_dropdown = document.createElement("div");
  colors_dropdown.classList.add("colors");
  let colors_close_btn = document.createElement("div");
  colors_close_btn.classList.add("color");
  colors_close_btn.innerHTML = `
    <div class="icon_up">
      <i class="fas fa-chevron-up"></i>
    </div>
  `;
  colors_dropdown.appendChild(colors_close_btn);
  colors_close_btn.addEventListener("click", function () {
    closeColorsDropDown(this.parentNode, colors_dropdown_trigger);
  });

  let colors_list = [];
  for (let i = 1; i <= 6; i++) {
    let color = document.createElement("div");
    color.classList.add("color");
    let color_trigger = document.createElement("div");
    color_trigger.classList.add("col");
    color_trigger.classList.add(`col-${i}`);
    color.appendChild(color_trigger);
    color_trigger.addEventListener("click", changeColor);
    colors_list.push(color);
  }
  colors_list.forEach((c) => {
    colors_dropdown.appendChild(c);
  });
  div_color_inner.appendChild(colors_dropdown);
  div_color_container.appendChild(div_color_inner);
  div_container.appendChild(div_color_container);

  document.addEventListener("click", (e) => {
    if (
      e.target !== colors_dropdown &&
      !colors_dropdown.contains(e.target) &&
      e.target !== colors_dropdown_trigger &&
      !colors_dropdown_trigger.contains(e.target)
    ) {
      closeColorsDropDown(colors_dropdown, colors_dropdown_trigger);
    }
  });
  return div_container;
}
///////////////// Helper Fnctions /////////////////

//// Open Modal ////
document.querySelector(".add_new").addEventListener("click", () => {
  modal.style.display = "flex";
  createNewBox.classList.remove(createNewBox.classList[1]);
  createNewBox.classList.add("col-4");
  newChooseColorTrigger.children[1].classList.remove(
    newChooseColorTrigger.children[1].classList[1]
  );
  newChooseColorTrigger.children[1].classList.add("col-4");
  createNewBox.classList.add("bigEntrance");
  setTimeout(() => {
    createNewBox.classList.remove("bigEntrance");
  }, 1000);
});
//// Open Modal ////

//// Create New Note ////
function editModeCheck() {
  if (createNewBox.hasAttribute("data-mode")) {
    editCurrentNote();
  } else {
    createNote();
  }
}
newCreate.addEventListener("click", function () {
  editModeCheck();
});

newDescription.addEventListener("keydown", function (e) {
  const keyCode = e.which || e.keyCode;
  if (keyCode === 13 && e.ctrlKey) {
    editModeCheck();
  }
});

newTitle.addEventListener("keydown", function (e) {
  const keyCode = e.which || e.keyCode;
  if (keyCode === 13) {
    e.preventDefault();
    editModeCheck();
  }
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
  if (createNewBox.hasAttribute("data-mode")) {
    closeModal();
  } else {
    removeText(newTitle, newDescription);
  }
});
//// Trash Note ////

//// Close Note on modal body click ////
// modal.addEventListener("click", (e) => {
//   if (e.target !== createNewBox && !createNewBox.contains(e.target)) {
//     closeModal();
//   }
// });
//// Close Note on modal body click ////

//// Choose Color Function ////
newChooseColorTrigger.addEventListener("click", function () {
  if (!this.classList.contains("show")) {
    this.classList.add("show");
    newChooseColorDropdown.style.display = "block";
    newChooseColorDropdown.classList.add("pullDownChoose");
    setTimeout(() => {
      newChooseColorDropdown.classList.remove("pullDownChoose");
    }, 500);
  }
});

document
  .querySelector(".close_new_choose_dropdown")
  .addEventListener("click", () => {
    closeNewChooseDropdown();
  });

document.addEventListener("click", (e) => {
  if (e.target !== newChooseColor && !newChooseColor.contains(e.target)) {
    closeNewChooseDropdown();
  }
});

document.querySelectorAll(".create_new_box_col").forEach((c) => {
  c.addEventListener("click", function () {
    newChooseColorTrigger.children[1].classList.remove(
      newChooseColorTrigger.children[1].classList[1]
    );
    newChooseColorTrigger.children[1].classList.add(this.classList[1]);
    createNewBox.classList.remove(createNewBox.classList[1]);
    createNewBox.classList.add(this.classList[1]);
    closeNewChooseDropdown();
  });
});
//// Choose Color Function ////

//// Drag and Drop ////
function initializeDragAndDrop(c) {
  let cOffX = c.getBoundingClientRect().x;
  let cOffY = c.getBoundingClientRect().y;
  c.addEventListener("mousedown", dragStart);
  c.addEventListener("touchstart", touchStart);
  let clonedEl;

  function moveElements(xPos, yPos) {
    const dragging = document.querySelector(".dragging");
    const x = xPos;
    const y = yPos;
    const dragged = document.querySelector(".dragged");

    const draggableElements = [...c.parentNode.querySelectorAll(".note")];
    const draggedElement = draggableElements.indexOf(dragged);

    notesColumns.forEach((c, i) => {
      const elementDetails = c.getBoundingClientRect();
      const top = elementDetails.top;
      const right = elementDetails.right;
      const bottom = elementDetails.bottom;
      const left = elementDetails.left;
      let draggableElementsInner = [...c.children];
      const draggedElementOuter = draggableElementsInner.indexOf(dragged);

      if (x > left && x < right) {
        if (y > top && y < bottom) {
          if (draggedElementOuter === -1) {
            if (c.children.length === 0) {
              changeNoteContainer(dragged, draggedElement);
              c.appendChild(dragged);
            } else {
              draggableElementsInner.forEach((el, i) => {
                const elementDetails = el.getBoundingClientRect();
                const left = elementDetails.left;
                const right = elementDetails.right;
                const bottom = elementDetails.bottom;
                if (
                  draggableElementsInner[i + 1] &&
                  x > left &&
                  x < right &&
                  y > bottom &&
                  y <
                    draggableElementsInner[i + 1].getBoundingClientRect().bottom
                ) {
                  changeNoteContainer(dragged, draggedElement);
                  dragged.style.opacity = "0";
                  insertAfter(draggableElementsInner[i], dragged);
                  for (let k = i + 1; k < draggableElementsInner.length; k++) {
                    const current = draggableElementsInner[k];
                    current.style = `--tStart:-${
                      dragged.getBoundingClientRect().height + 30
                    }px; --tEnd:0px`;
                    current.classList.add("transformFromTo");
                    setTimeout(() => {
                      dragged.removeAttribute("style");
                      current.removeAttribute("style");
                      current.classList.remove("transformFromTo");
                    }, 150);
                  }
                } else if (
                  y >
                  draggableElementsInner[
                    draggableElementsInner.length - 1
                  ].getBoundingClientRect().bottom
                ) {
                  changeNoteContainer(dragged, draggedElement);
                  c.appendChild(dragged);
                } else if (
                  y < draggableElementsInner[0].getBoundingClientRect().bottom
                ) {
                  if (!dragged.hasAttribute("style")) {
                    dragged.style.opacity = "0";
                    changeNoteContainer(dragged, draggedElement);
                  }
                  c.insertBefore(dragged, draggableElementsInner[0]);
                  el.style = `--tStart:-${
                    dragged.getBoundingClientRect().height + 30
                  }px; --tEnd:0px`;
                  el.classList.add("transformFromTo");
                  setTimeout(() => {
                    dragged.removeAttribute("style");
                    el.removeAttribute("style");
                    el.classList.remove("transformFromTo");
                  }, 150);
                }
              });
            }
          }
        }
      }
    });
    draggableElements.forEach((c, i) => {
      const elementDetails = c.getBoundingClientRect();
      const top = elementDetails.top;
      const right = elementDetails.right;
      const bottom = elementDetails.bottom;
      const left = elementDetails.left;

      if (x > left && x < right) {
        if (y > top && y < bottom) {
          if (!c.classList.contains("dragged")) {
            if (i !== draggedElement) {
              function changeElement() {
                draggableElements.splice(draggedElement, 1);
                draggableElements.splice(i, 0, dragged);
                draggableElements.forEach((c) => {
                  c.parentNode.appendChild(c);
                });
              }
              function transformElement() {
                if (!c.hasAttribute("style")) {
                  const currentElement = draggableElements.indexOf(c);
                  changeElement();
                  if (currentElement > draggedElement) {
                    c.style = `--tStart:${
                      dragged.getBoundingClientRect().height + 30
                    }px; --tEnd:0px`;
                  } else {
                    c.style = `--tStart:-${
                      dragged.getBoundingClientRect().height + 30
                    }px; --tEnd:0px`;
                  }
                  c.classList.add("transformFromTo");
                  setTimeout(() => {
                    c.removeAttribute("style");
                    c.classList.remove("transformFromTo");
                  }, 150);
                }
              }
              const dW = dragged.getBoundingClientRect();
              const cW = c.getBoundingClientRect();
              const dL = dW.height + 30;
              if (!dragged.hasAttribute("style")) {
                if (cW.height > dW.height) {
                  if (y < cW.top + dL) {
                    transformElement();
                  }
                } else {
                  transformElement();
                }
              }
            }
          }
        }
      }
    });
  }

  function dragStart(e) {
    e = e || window.event;
    e.preventDefault();

    const editBtn = this.children[3].children[0];
    const colors = this.children[3].children[1];
    const closeBtn = this.children[2];

    if (
      e.target !== colors &&
      !colors.contains(e.target) &&
      e.target !== closeBtn &&
      !closeBtn.contains(e.target) &&
      e.target !== editBtn &&
      !editBtn.contains(e.target) &&
      !c.classList.contains("closeTriggered")
    ) {
      clonedEl = c.cloneNode(true);
      document.body.appendChild(clonedEl);
      cOffX = e.pageX - c.offsetLeft;
      cOffY = e.pageY - c.offsetTop;

      clonedEl.style.width = `${c.getBoundingClientRect().width}px`;
      clonedEl.style.top = `${e.pageY - cOffY}px`;
      clonedEl.style.left = `${e.pageX - cOffX}px`;

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);

      clonedEl.classList.add("dragging");
      c.classList.add("dragged");

      notesColumns.forEach((c) => {
        [...c.children].forEach((el) => {
          if (el.hasAttribute("style")) {
            el.removeAttribute("style");
          }
        });
      });
    }
  }

  function dragMove(e) {
    e = e || window.event;
    e.preventDefault();
    clonedEl.style.top = (e.pageY - cOffY).toString() + "px";
    clonedEl.style.left = (e.pageX - cOffX).toString() + "px";
    moveElements(e.clientX, e.clientY);
  }

  function touchStart(e) {
    e = e || window.event;

    const editBtn = this.children[3].children[0];
    const colors = this.children[3].children[1];
    const closeBtn = this.children[2];
    if (
      e.target !== colors &&
      !colors.contains(e.target) &&
      e.target !== closeBtn &&
      !closeBtn.contains(e.target) &&
      e.target !== editBtn &&
      !editBtn.contains(e.target) &&
      !c.classList.contains("closeTriggered")
    ) {
      clonedEl = c.cloneNode(true);
      document.body.appendChild(clonedEl);
      cOffX = e.changedTouches[0].clientX - c.offsetLeft;
      cOffY = e.changedTouches[0].clientY - c.offsetTop;

      clonedEl.style.width = `${c.getBoundingClientRect().width}px`;
      clonedEl.style.top = `${e.changedTouches[0].clientY - cOffY}px`;
      clonedEl.style.left = `${e.changedTouches[0].clientX - cOffX}px`;

      document.addEventListener("touchmove", touchMove);
      document.addEventListener("touchend", dragEnd);

      clonedEl.classList.add("dragging");
      c.classList.add("dragged");

      notesColumns.forEach((c) => {
        [...c.children].forEach((el) => {
          if (el.hasAttribute("style")) {
            el.removeAttribute("style");
          }
        });
      });
    }
  }

  function touchMove(e) {
    e = e || window.event;
    clonedEl.style.top =
      (e.changedTouches[0].clientY - cOffY).toString() + "px";
    clonedEl.style.left =
      (e.changedTouches[0].clientX - cOffX).toString() + "px";

    moveElements(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  function dragEnd(e) {
    e = e || window.event;
    e.preventDefault();

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    document.removeEventListener("touchmove", touchMove);
    document.removeEventListener("touchend", dragEnd);

    const ghost = document.querySelector(".dragging");
    ghost.style.transition = `all 0.15s linear`;
    ghost.style.top = `${c.getBoundingClientRect().top + window.scrollY}px`;
    ghost.style.left = `${c.getBoundingClientRect().left}px`;
    setTimeout(() => {
      c.classList.remove("dragged");
      document.body.removeChild(ghost);
    }, 150);
  }
}
//// Drag and Drop ////

//// Save to local storage ////
const data = {
  "1stRow": [
    {
      color: "col-1",
      title: "Business Ideas",
      description:
        "What is Lorem Ipsum? \n \nLorem Ipsum is simply dummy text of the printing and typesetting industry  \n \nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      color: "col-3",
      title: "2021 Goals and KPIs",
      description:
        "2x monthly revenue \n \n Increase ARPU by +15% \n \n CAGR Maintain MoM growth over 5% \n \n 3 new MVP launches",
    },
    {
      color: "col-2",
      title: "Recent contacts",
      description:
        "Send reminder to Tomo to collect previous sales presentations for similar clients \n \n Set meeting with Tomo & team Prepare_",
    },
    {
      color: "col-4",
      title: "Dumb",
      description:
        "Send reminder to Tomo to collect previous sales presentations for similar clients \n \n Set meeting with Tomo & team Prepare_",
    },
  ],
  "2stRow": [
    {
      color: "col-6",
      title: "2022 Strategy",
      description:
        "Validate market entry into SEA markets \n \n Develop sales strategy focusing on Tier 1 clients in Manufacturing sectors \n \n Enhance admin functions, especially HR",
    },
    {
      color: "col-4",
      title: "Organizational thoughts",
      description:
        "Key requirements for Marketing Lead \n Transparency \n Agility \n Logical thinking \n",
    },
  ],
  "3stRow": [
    {
      color: "col-5",
      title: "Sales attack list",
      description:
        "ABC Co \n \n BBB and Company \n \n CDE-inc \n \n TUV Capital",
    },
    {
      color: "col-2",
      title: "Vision/Values memo",
      description:
        "Nike \n \n  Our mission is to bring inspiration and innovation to every athlete* in the world. [*If you have a body, you are an athlete.] Airbnb Values Champion the Mission Be a Host Simplify",
    },
    {
      color: "col-5",
      title: "Values memo",
      description:
        "Nike \n \n  Our mission is to bring inspiration and innovation to every athlete* in the world. [*If you have a body, you are an athlete.] Airbnb Values Champion the Mission Be a Host Simplify",
    },
  ],
};
Object.keys(data).forEach((c, i) => {
  data[c].forEach((d) => {
    const newNote = createNoteNode(d);
    notesColumns[i].appendChild(newNote);
    initializeDragAndDrop(newNote);
  });
});
//// Save to local storage ////
