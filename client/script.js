import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;

function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    const uniqueId = `id-${timestamp}-${hexadecimalString}`;
    return uniqueId;
}

function chatStripe(isAi, value, uniqueId) {
    return `
        <div class="wrapper ${isAi ? 'ai' : ''}">
            <div class="chat">
                <div class="profile">
                    <img src=${isAi ? bot : user} alt="${isAi ? 'bot' : 'user'}" />
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const userInput = data.get('prompt');

    if (!userInput) {
        return;
    }
    chatContainer.innerHTML += chatStripe(false, userInput);
    form.reset();
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    try {
        const response = await fetch('https://codex-lc6q.onrender.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userInput }),
        });

        clearInterval(loadInterval);
        messageDiv.innerHTML = " ";

        if (response.ok) {
            const data = await response.json();
            console.log("Data parsed from response:", data);
            messageDiv.innerHTML = data.bot;
            
          
        } else {
            const errMessage = await response.text();
            console.error("Error response received:", errMessage);
            throw new Error(errMessage);
        }
    } catch (error) {
        messageDiv.innerHTML = "Something went wrong";
        alert(`Error: ${error.message}`);
    }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
});
