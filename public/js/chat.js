const socket = io();

// *Message Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("content");
const $sendMessage = document.getElementById("sendMessage");
const $messages = document.getElementById("messages");

// * Location Elements
const $sendLocation = document.getElementById("sendLocation");

// *Templates
const messageTemplate = document.getElementById("msgTemplate").innerHTML;
const locationTemplate = document.getElementById("locTemplate").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// *Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // *New Message
  const $newMessage = $messages.lastElementChild;

  // * height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // * Visible height
  const visibleHeight = $messages.offsetHeight;

  // * Height Messages container
  const containerHeight = $messages.scrollHeight;

  // *Scroll offset
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.url,
    createdAt: moment(url.createdAt).format("hh:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

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
      (location) => {}
    );
  });
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.getElementById("sidebar").innerHTML = html;
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
