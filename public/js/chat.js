const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("Form submit!");

  const message = e.target.elements.content.value;

  socket.emit("sendMessage", message, (message)=>{
    console.log("Message delivered successfully", message)
  });
});

document.getElementById('sendLocation').addEventListener('click', ()=>{
    if(!navigator.geolocation){
      return alert("Geolocation is not supported by this browser")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      socket.emit("sendLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    })

})