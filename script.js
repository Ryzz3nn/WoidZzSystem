// script.js

const token = '7302018050:AAH7S1k2LS9NAys-jPsv4ruNVFW2ekD3EYg';
const mainChatId = '-1002165003920'; // Replace with the correct main chat ID
const notificationChatId = '-1002150759513'; // Replace with the correct notification chat ID
let lastUpdateId = 0;

document.getElementById('order1').addEventListener('click', () => {
    sendOrderWithKeyboard('Diablo 4\nUber Build');
});

document.getElementById('order2').addEventListener('click', () => {
    sendOrderWithKeyboard('Order 2:\nBurger\nFries\nSoda');
});

document.getElementById('order3').addEventListener('click', () => {
    sendOrderWithKeyboard('Order 3:\nSushi\nSake\nMiso Soup');
});

function sendOrderWithKeyboard(message) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: mainChatId,
        text: message,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'I Want This Order', callback_data: 'requestOrder' }]
            ]
        }
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);
        if (data.ok) {
            alert('Order options sent successfully!');
        } else {
            alert(`Failed to send order options: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending order options. Check the console for details.');
    });
}

function handleCallbackQuery(callbackQuery) {
    const url = `https://api.telegram.org/bot${token}/answerCallbackQuery`;
    const data = {
        callback_query_id: callbackQuery.id,
        text: 'Received!'
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (callbackQuery.data === 'requestOrder') {
        sendInitialMessage(callbackQuery.from.id, callbackQuery.message.message_id);
    } else if (callbackQuery.data.startsWith('confirmOrder')) {
        const time = callbackQuery.data.split(':')[1];
        notifyAndDeleteOrder(callbackQuery.from.username, time, callbackQuery.message.message_id);
    }
}

function sendInitialMessage(chatId, messageId) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: 'Please send the time you can start.',
        reply_markup: {
            force_reply: true
        }
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Initial DM Response:', data);
        if (data.ok) {
            alert('Initial DM sent successfully!');
        } else {
            alert(`Failed to send initial DM: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending initial DM. Check the console for details.');
    });
}

function notifyAndDeleteOrder(username, time, messageId) {
    // Send notification to another channel
    const notifyUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const notifyData = {
        chat_id: notificationChatId,
        text: `User @${username} can start at ${time}`
    };

    fetch(notifyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifyData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification Response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Delete the initial order message in the main channel
    const deleteUrl = `https://api.telegram.org/bot${token}/deleteMessage`;
    const deleteData = {
        chat_id: mainChatId,
        message_id: messageId
    };

    fetch(deleteUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete Message Response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sendDM(chatId, message) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Confirm Order', callback_data: `confirmOrder:${message}` }]
            ]
        }
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('DM API Response:', data);
        if (data.ok) {
            alert('DM sent successfully!');
        } else {
            alert(`Failed to send DM: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending DM. Check the console for details.');
    });
}

// Polling for updates to handle callback queries and user responses
function pollUpdates() {
    const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            data.result.forEach(update => {
                if (update.callback_query) {
                    handleCallbackQuery(update.callback_query);
                } else if (update.message && update.message.reply_to_message) {
                    // Handle user response with the time they can start
                    const time = update.message.text;
                    const username = update.message.from.username;
                    const messageId = update.message.reply_to_message.message_id;
                    notifyAndDeleteOrder(username, time, messageId);
                }
                lastUpdateId = update.update_id;
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Start polling for updates
setInterval(pollUpdates, 5000);
