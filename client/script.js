document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:3000");
    let ui_messages = document.getElementById("ui-messages");
    let ui_message_label = document.querySelector('label[for="ui-messages-input"]');
    let ui_message_input = document.getElementById("ui-messages-input")
    let ui_room_input = document.getElementById("ui-room-input")
    let ui_user_id = document.getElementById("ui-user-id")
    let ui_room_id = document.getElementById("ui-room-id")
    let user_id = ""
    let room_id = ""

    ui_message_input.style.visibility = "hidden";
    ui_message_label.style.visibility = "hidden";

    ui_room_input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            room_id = ui_room_input.value;
            ui_room_id.textContent = "Current Room ID: " + room_id;
            ws.send(JSON.stringify({
                userId: user_id,
                message: user_id + " joined room " + room_id,
                roomId: room_id
            }));
            ui_room_input.value = "";
            ui_message_input.style.visibility = "visible";
        }
    });

    ui_message_input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            ws.send(JSON.stringify({
                userId: user_id,
                message: ui_message_input.value,
                roomId: room_id
            }));
            ui_message_input.value = "";
        }
    });

    ws.addEventListener("message", function(event) {
        let data = JSON.parse(event.data);

        if (data.userId && user_id === "") {
            user_id = data.userId;
            ui_user_id.textContent = "User ID: " + user_id;
            console.log("initializing user")
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