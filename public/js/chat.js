const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

// *Message Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("content");
const $sendMessage = document.getElementById("sendMessage");

// * Location Elements
const $sendLocation = document.getElementById("sendLocation");

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // * disable on send
  $sendMessage.setAttribute("disabled", "disabled");
  const message = $messageFormInput.value;

  socket.emit("sendMessage", message, (message) => {
    // *enable
    $sendMessage.removeAttribute("disabled", "disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    console.log("Message delivered successfully client side ||", message);
  });
});

$sendLocation.addEventListener("click", () => {
  $sendLocation.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by this browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    $sendLocation.removeAttribute("disabled", "disabled");
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (location) => {
        console.log("Location Sent Client side ||", location);
      }
    );
  });
});
