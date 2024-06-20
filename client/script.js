function convertFileToBase64(file, callback) {
  let reader = new FileReader();
  reader.onload = function (event) {
    callback(event.target.result);
  };
  reader.readAsDataURL(file);
}

function convertBase64ToFile(base64String) {
  let arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  let blob = new Blob([u8arr], { type: mime });
  let url = URL.createObjectURL(blob);

  return url;
}

document.addEventListener("DOMContentLoaded", function () {
  const ws = new WebSocket("ws://localhost:3000");
  let ui_room_label = document.querySelector('label[for="ui-room-input"]');
  let ui_room_input = document.getElementById("ui-room-input");
  let ui_user_id = document.getElementById("ui-user-id");
  let ui_room_id = document.getElementById("ui-room-id");
  let ui_document = document.getElementById("ui-document");
  let ui_file_input = document.getElementById("ui-file-input");
  let user_id = "";
  let room_id = "";

  ws.addEventListener("message", function (event) {
    let data = JSON.parse(event.data);
    let url = convertBase64ToFile(data.message);

    let img = new Image();
    img.src = url;
    img.width = 200;
    img.height = 200;
    document.body.appendChild(img);
    
    ui_document.value = message;

    // On Connection, set up ID
    if (data.userId && user_id === "") {
      user_id = data.userId;
      ui_user_id.textContent = "User ID: " + user_id;
      console.log("initializing user");
      return;
    }

    console.log("USER ID: ", user_id);
    console.log("Received message!", data);
  });

  ui_file_input.addEventListener("change", function (event) {
    let file = event.target.files[0];

    console.log("File: ", file);

    convertFileToBase64(file, function (base64String) {
      console.log("File: ", base64String);

      ws.send(
        JSON.stringify({
          userId: user_id,
          message: base64String,
          roomId: room_id,
        })
      );
    });
  });

  ui_room_input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      room_id = ui_room_input.value;
      ui_room_id.textContent = "Current Room ID: " + room_id;
      ws.send(
        JSON.stringify({
          userId: user_id,
          message: user_id + " joined room " + room_id,
          roomId: room_id,
        })
      );
      ui_room_input.value = "";
      ui_room_input.style.display = "none";
      ui_room_label.style.display = "none";
    }
  });

  ui_document.addEventListener("input", function (event) {
    let message = ui_document.value;
    ws.send(
      JSON.stringify({
        userId: user_id,
        message: message,
        roomId: room_id,
      })
    );
  });
});
