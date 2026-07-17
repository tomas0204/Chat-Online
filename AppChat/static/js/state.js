export let socket = null;
export let currentReceiver = null;

export function setSocket(newSocket) {
    socket = newSocket;
}

export function setCurrentReceiver(receiver) {
    currentReceiver = receiver;
}

export const currentUser = document.body.dataset.username;
export const input = document.querySelector(".conversation-form-input");
export const sendBtn = document.querySelector(".conversation-form-submit");
export const recentMessagesContainer = document.getElementById("recent-messages");
