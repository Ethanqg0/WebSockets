document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:3000");
    const ui_messages = document.getElementById("ui-messages");

    ws.addEventListener("open", function(event) {
        console.log("Connected to server");
        ws.send("Hello from client!");
    })

    ws.addEventListener("message", function(event) {
        console.log("Message from server: ", event.data);
        ws.send("Hello from client!")
        const message = document.createElement("li");
        message.textContent = event.data;
        ui_messages.appendChild(message);
    })
})