const message_container = document.querySelector(".message-container")
const post_response = document.getElementById("_post_response")

const socket = io("https://anonymously-yours-server.netlify.app")
socket.on("connect", () => console.log("Connection Successfully Established."))

setInterval(() => {
  socket.emit("receive_json")
}, 1000)

socket.on("json_response", (messages) => {
  messages.sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })
  messages.reverse()
  let messages_important = messages.filter((message) => {
    return message.important == true
  })
  messages_important.forEach((message) => {
    messages.splice(messages.indexOf(message), 1)
  })

  message_container.textContent = ""
  if (messages.length < 1) {
    let _card = document.createElement("div")
    _card.classList.add("message-card")
    _card.textContent = "No responses stored in the database"
    message_container.append(_card)
  }
  for (let i = 0; i < messages_important.length; i++) {
    createCard(messages_important[i])
  }
  for (let i = 0; i < messages.length; i++) {
    createCard(messages[i])
  }
})

function createCard(data) {
  let _card = document.createElement("div")
  _card.classList.add("message-card")

  if (data.highlighted == true) _card.classList.add("highlighted")
  if (data.important == true) _card.classList.add("important")

  let span = {
    receiver: document.createElement("span"),
    sender: document.createElement("span"),
    message: document.createElement("span"),
    date: document.createElement("span"),
  }

  span.receiver.textContent = `To: ${data.receiver}`
  span.sender.textContent = `From: ${data.sender}`
  span.message.textContent = `Message: ${data.message}`

  let _date = dayjs(data.date)
  span.date.textContent = `${_date.format("MMMM D, YYYY - h:mm a")}`

  _card.append(span.receiver)
  _card.append(span.sender)
  _card.append(span.message)
  _card.append(span.date)

  message_container.append(_card)
}

post_response.addEventListener("click", () => {
  window.location.href = "/"
})
