const form = {
  element: document.getElementById("message_form"),
  receiver: document.getElementById("_receiver"),
  sender: document.getElementById("_sender"),
  message: document.getElementById("_message"),
  submit: document.getElementById("_submit"),
  view_response: document.getElementById("_view_responses"),
}

const socket = io("https://anonymously-yours-ijkz.onrender.com")
socket.on("connect", () => console.log("Connection Successfully Established."))

const query = new Proxy(new URLSearchParams(window.location.search), {
  get: (search_query, prop) => search_query.get(prop),
})

let _message_filter =
  /arse|arsehead|arsehole|ass|asshole|bastard|bitch|bollocks|brotherfucker|bullshit|child-fucker|cocksucker|cock|crap|cunt|damn|dickhead|dick|die |dumbass|dyke|fatherfucker|frigger|fucking|fucker|fuckface|fuck|fwock|goddamn| hell |holy shit|horseshit|kill|kys|motherfucker|nigga|nigger|pigfucker|piss|prick|pussy|shit|shit ass|shite|sisterfucker|slut|son of a whore|son of a bitch|stupid|turd|twat|wanker/gi

let _submitted = false

form.element.addEventListener("submit", (event) => {
  event.preventDefault()

  let _receiver_value = form.receiver.value
  let _sender_value = form.sender.value
  let _message_value = form.message.value

  // Sanitize Inputs
  _receiver_value = _receiver_value.replace(_message_filter, (a) => {
    return "#".repeat(a.length)
  })
  _sender_value = _sender_value.replace(_message_filter, (a) => {
    return "#".repeat(a.length)
  })
  _message_value = _message_value.replace(_message_filter, (a) => {
    return "#".repeat(a.length)
  })

  // Prevent Double Submits
  if (_submitted) return false
  // Invalid Messages
  if (_receiver_value == "" || _sender_value == "" || _message_value == "") {
    modal.heading.textContent = "Notice"
    modal.message.textContent = ""

    if (_receiver_value == "") {
      modal.message.append(
        (document.createElement("p").textContent =
          "Receiver input cannot be empty!")
      )
    } else if (_sender_value == "") {
      modal.message.append(
        (document.createElement("p").textContent =
          "Sender input cannot be empty!")
      )
    } else if (_message_value == "") {
      modal.message.append(
        (document.createElement(
          "p"
        ).textContent = `Please write something towards: '${_receiver_value}'. After all, you ARE here to give a message related to them right?`)
      )
    }

    modal.element.style.display = "flex"
    return false
  }
  // Check Message Length
  if (_message_value.trim().split(" ").length > 50) {
    modal.heading.textContent = "Notice"
    modal.message.textContent = ""
    modal.message.append(
      (document.createElement(
        "p"
      ).textContent = `You wrote too much.. perhaps you should make your message a bit more concise... Amount of words you are using: ${
        _message_value.trim().split(" ").length
      }`)
    )
    modal.element.style.display = "flex"
    return false
  }
  // Label as 'Submitted' if checks are passed
  _submitted = true

  let _highlighted = false
  let _important = false
  if (query.token == "facil-723061105") _highlighted = true
  if (query.token == "facil-628130224") _important = true

  console.log(
    `Receiver: "${_receiver_value}"\nSender: "${_sender_value}"\nMessage: "${_message_value}"\nHighlighted?: "${_highlighted}"\nImportant?: "${_important}"`
  )

  socket.emit("send_json", {
    receiver: _receiver_value,
    sender: _sender_value,
    message: _message_value,
    highlighted: _highlighted,
    important: _important,
    date: new Date(),
  })

  setTimeout(() => {
    window.location = "/responses/"
  }, 2500)
})

form.view_response.addEventListener("click", () => {
  window.location.href = "/responses/"
})
