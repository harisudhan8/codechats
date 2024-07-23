document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const roomInput = document.getElementById('room');
    const joinRoomButton = document.getElementById('joinRoom');
    const waitingMessage = document.getElementById('waitingMessage');
    const chat = document.getElementById('chat');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');

    joinRoomButton.addEventListener('click', () => {
        const room = roomInput.value.trim();
        if (room) {
            socket.emit('joinRoom', room);
        }
    });

    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('message', { room: roomInput.value, message });
            messageInput.value = '';
        }
    });

    socket.on('waiting', (message) => {
        waitingMessage.innerText = message;
        chat.style.display = 'none';
    });

    socket.on('startChat', (message) => {
        waitingMessage.innerText = '';
        chat.style.display = 'block';
    });

    socket.on('message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messages.appendChild(messageElement);
    });
});
