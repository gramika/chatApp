// connects to server
const socket = io();

let myName = '';
while (!myName) {
    myName = prompt('username:') || '';
}
document.getElementById('nameDisplay').textContent = myName;
socket.emit('join', myName);

// to find the form,input box and chatarea to be controlled by js

const form = document.getElementById('chatForm');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');

// send a chat message 
form.addEventListener("submit", (e) => {
    e.preventDefault(); //to dtop page reloading
    const text = input.value.trim();
    if (!text) return;

    // sending msgs to the server
    socket.emit("chatMessage", {
        username: myName,
        message: text
    });
    // clear input box
    input.value = "";
    input.focus();  //keeps the cursor in the input box itself, for the next msgs

});

// receive a chat message
socket.on("chatMessage", (data) => {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");
    messageDiv.classList.add(data.username === myName ? "self" : "other");

    // add name,time and message
    messageDiv.innerHTML = `
    <div>
      <strong>${escapeHtml(data.username)}</strong>
      <small class="text-muted">${escapeHtml(data.time)}</small>
    </div>
    <div>${escapeHtml(data.message)}</div>
    `
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
});

// join/leave messages done by sytem
socket.on("user-joined", (username) => {
    addSystemMessage(`${username} joined the chat`);
});

socket.on("user-left", (username) => {
    addSystemMessage(`${username} left the chat`);
});

function addSystemMessage(text) {
    const el = document.createElement("div");
    el.className = "system-message";
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
}

//  to safely show user messages as plain text (not code)
function escapeHtml(unsafe) {
    return String(unsafe).replace(/[&<>"']/g, (m) => {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m];
    });
}