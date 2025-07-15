import bot from './assets/bot.png'
import botDark from './assets/bot_dark.png';
import user from './assets/user.png'
import userDark from './assets/user_dark.png';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const app = document.getElementById('app');
const textarea = form.querySelector('textarea');

let loadInterval;

// Bot output while thinking
function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....................') {
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++;
        } else {
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    const isDark = document.body.classList.contains('dark');

    // Check whether to use dark or light colored bot and user
    const imageSrc = isAi
        ? isDark ? botDark : bot
        : isDark ? userDark : user;

    return `
        <div class="wrapper ${isAi ? 'ai' : ''}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src="${imageSrc}" 
                      alt="${isAi ? 'bot' : 'user'}" 
                      style="width: 30px; height: 30px;"
                    />
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
    `
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = textarea.value.trim();
    if (!prompt) return;

    // Switch to active layout
    app.classList.remove('centered')
    app.classList.add('active')

    // Add user message (User chatstripe)
    chatContainer.innerHTML += chatStripe(false, prompt);
    form.reset();

    // Bot message placeholder (Bot chatstripe)
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

}

// Enter key causes prompt to be submitted
form.addEventListener('submit', handleSubmit);

textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {  
        e.preventDefault(); // prevent default newline associated with event
        handleSubmit(e); // submit form
    }
});

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const sendIcon = document.getElementById('send-icon');

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');

  themeIcon.src = isDark ? './assets/sun.png' : './assets/moon.png';
  sendIcon.src = isDark ? './assets/send.svg' : './assets/send_dark.svg';

  // For all of the bot and user icons in the chat container when toggling between dark and light mode
  document.querySelectorAll('.profile img').forEach(img => {
    const isBot = img.alt === 'bot';
    img.src = isBot
      ? isDark ? bot : botDark
      : isDark ? user : userDark;
  });
});