const socket = io()


socket.on('message', (message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault()

    console.log("Form submit!")

    const message = document.querySelector('input').value


    socket.emit('sendMessage', message)


})