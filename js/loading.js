const e_logo = document.querySelector(".main-logo")
const e_form = document.getElementById("message_form")

const modal = {
  element: document.getElementById("modal_notification"),
  heading: document.getElementById("_modal_heading"),
  message: document.getElementById("_modal_message"),
  close: document.getElementById("_modal_close"),
}

setTimeout(() => {
  e_logo
    .animate(
      [
        {
          opacity: 0,
        },
      ],
      { direction: "normal", duration: 1000 }
    )
    .finished.then(() => {
      e_logo.style.display = "none"
      e_form.style.display = "flex"
      e_form
        .animate([{ opacity: 1 }], {
          direction: "normal",
          duration: 1000,
          fill: "forwards",
        })
        .finished.then(() => {
          setTimeout(() => {
            modal.element.style.display = "flex"
            modal.element.animate([{ opacity: 1 }], {
              direction: "normal",
              duration: 500,
              fill: "forwards",
            })
          }, 500)
        })
    })
}, 2000)

modal.close.addEventListener("click", () => {
  modal.element.style.display = "none"
})
