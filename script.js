document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    // Отправка по нажатию кнопки
    sendButton.addEventListener('click', sendMessage);

    // Отправка по нажатию Enter
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        // Прокрутка вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        userInput.value = '';
        addMessage('Думаю...', 'assistant'); // Показываем индикатор загрузки

        try {
            // Вот здесь мы обращаемся к нашей серверной функции
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Удаляем "Думаю..." и вставляем реальный ответ
            chatMessages.removeChild(chatMessages.lastChild);
            addMessage(data.reply, 'assistant');

        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            chatMessages.removeChild(chatMessages.lastChild);
            addMessage('Произошла ошибка. Попробуйте снова.', 'assistant');
        }
    }
});
