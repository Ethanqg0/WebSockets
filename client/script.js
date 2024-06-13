document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:3000");
    let ui_room_label = document.querySelector('label[for="ui-room-input"]');
    let ui_room_input = document.getElementById("ui-room-input")
    let ui_user_id = document.getElementById("ui-user-id")
    let ui_room_id = document.getElementById("ui-room-id")
    let ui_document = document.getElementById("ui-document")
    let user_id = ""
    let room_id = ""

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
            ui_room_input.style.display = "none";
            ui_room_label.style.display = "none";
        }
    });

    ui_document.addEventListener("input", function (event) {
        let message = ui_document.value;
        ws.send(JSON.stringify({
            userId: user_id,
            message: message,
            roomId: room_id
        }));
    });

    ws.addEventListener("message", function(event) {
        let data = JSON.parse(event.data);
        ui_document.value = data.message;

        // On Connection, set up ID
        if (data.userId && user_id === "") {
            user_id = data.userId;
            ui_user_id.value = "User ID: " + user_id;
            console.log("initializing user");
            return;
        } 

        console.log("USER ID: ", user_id);
        console.log("Received message!", data);
    });
});
