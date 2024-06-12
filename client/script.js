document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:3000");
    let ui_messages = document.getElementById("ui-messages");
    let ui_message_input = document.getElementById("ui-messages-input")
    let userId;

    ui_message_input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            ws.send(JSON.stringify({
                userId: userId,
                message: ui_message_input.value
            }));
            ui_message_input.value = "";
        }
    });

    ws.addEventListener("message", function(event) {
        console.log(event.data)
        let data = JSON.parse(event.data);
        if (data.userId && !userId) {
            userId = data.userId;
            let message = document.createElement('p')
            message.textContent = "User " + userId + " connected"
            ui_messages.appendChild(message)
        } else {
            let message = document.createElement('p')
            if (data.justConnected) {
                message.textContent = data.message
            } else {
                message.textContent = data.userId + ": " + data.message
            }
            ui_messages.appendChild(message)
        }
    })
})