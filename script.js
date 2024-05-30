const token = '7302018050:AAH7S1k2LS9NAys-jPsv4ruNVFW2ekD3EYg';
const mainChatId = '-1002165003920'; // Replace with the correct main chat ID
const notificationChatId = '-1002150759513'; // Replace with the correct notification chat ID
let lastUpdateId = 0;

function showOrders(category) {
    const initialText = document.getElementById('initial-text');
    const orderOptions = document.getElementById('order-options');
    const orderDetails = document.getElementById('order-details');
    
    initialText.classList.add('hidden');
    orderOptions.classList.remove('hidden');
    orderDetails.classList.add('hidden');
    orderOptions.innerHTML = ''; // Clear previous content

    let orders;
    if (category === 'leveling') {
        orders = [
            { title: 'Order 1', description: 'Description for Order 1', buttonColor: 'bg-blue-500', message: '#12321321627 | PC | DIABLO 4\n\nUber Build' },
            { title: 'Order 2', description: 'Description for Order 2', buttonColor: 'bg-green-500', message: 'Order 2:\nBurger\nFries\nSoda' },
            { title: 'Order 3', description: 'Description for Order 3', buttonColor: 'bg-red-500', message: 'Order 3:\nSushi\nSake\nMiso Soup' }
        ];
    } else if (category === 'currency') {
        orders = [
            { title: 'Currency Order 1', description: 'Description for Currency Order 1', buttonColor: 'bg-blue-500', message: 'Currency Order 1 message' },
            { title: 'Currency Order 2', description: 'Description for Currency Order 2', buttonColor: 'bg-green-500', message: 'Currency Order 2 message' },
            { title: 'Currency Order 3', description: 'Description for Currency Order 3', buttonColor: 'bg-red-500', message: 'Currency Order 3 message' }
        ];
    } else if (category === 'dungeons') {
        orders = [
            { title: 'Dungeon Order 1', description: 'Description for Dungeon Order 1', buttonColor: 'bg-blue-500', message: 'Dungeon Order 1 message' },
            { title: 'Dungeon Order 2', description: 'Description for Dungeon Order 2', buttonColor: 'bg-green-500', message: 'Dungeon Order 2 message' },
            { title: 'Dungeon Order 3', description: 'Description for Dungeon Order 3', buttonColor: 'bg-red-500', message: 'Dungeon Order 3 message' }
        ];
    }

    orders.forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card p-4 rounded shadow-lg text-center';
        orderCard.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${order.title}</h2>
            <p class="mb-4">${order.description}</p>
            <button id="order${index + 1}" class="${order.buttonColor} text-white px-4 py-2 rounded">Order Now</button>
        `;
        orderOptions.appendChild(orderCard);

        document.getElementById(`order${index + 1}`).addEventListener('click', () => {
            showOrderDetails(order.title, order.description, order.message);
        });
    });
}

function showOrderDetails(title, description, message) {
    const orderOptions = document.getElementById('order-options');
    const orderDetails = document.getElementById('order-details');

    orderOptions.classList.add('hidden');
    orderDetails.classList.remove('hidden');
    orderDetails.innerHTML = ''; // Clear previous content

    const detailsCard = document.createElement('div');
    detailsCard.className = 'details-card p-6 rounded shadow-lg text-center w-full';
    detailsCard.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${title}</h2>
        <p class="mb-6">${description}</p>
        <div class="flex justify-center items-center mb-6">
            <input type="number" id="currentLevel" class="text-black px-4 py-2 rounded mr-2" placeholder="Current Level" min="1" max="100">
            <span class="text-2xl mx-2">→</span>
            <input type="number" id="desiredLevel" class="text-black px-4 py-2 rounded ml-2" placeholder="Desired Level" min="1" max="100">
        </div>
        <div class="flex justify-center items-center mb-6 flex-wrap">
            <label class="mr-4 mb-2"><input type="checkbox" id="piloted" class="mr-2" data-price="0"> Piloted</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="selfplay" class="mr-2" data-price="0"> Selfplay</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="express" class="mr-2" data-price="1.09"> Express +€1.09</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="eternal" class="mr-2" data-price="2.73"> Eternal +€2.73</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="hardcore" class="mr-2" data-price="5.47"> Hardcore +€5.47</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="addMainCampaign" class="mr-2" data-price="32"> Add main campaign +€32</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="unlockTier" class="mr-2" data-price="0"> Unlock Tier 3 + Tier 4</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="battlePass" class="mr-2" data-price="-0.82"> My Battle Pass is at lvl 28 -€0.82</label>
            <label class="mr-4 mb-2"><input type="checkbox" id="stream" class="mr-2" data-price="7"> Stream +€7</label>
        </div>
        <div class="text-2xl font-bold mb-4">Total Price: €<span id="totalPrice">0.00</span></div>
        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="sendOrderWithKeyboard('${message}', '${title}')">Confirm Order</button>
    `;
    orderDetails.appendChild(detailsCard);

    // Add event listeners to checkboxes for price calculation
    document.querySelectorAll('#order-details input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });

    // Add event listeners to level inputs for price calculation if needed
    document.getElementById('currentLevel').addEventListener('input', updateTotalPrice);
    document.getElementById('desiredLevel').addEventListener('input', updateTotalPrice);
}

function updateTotalPrice() {
    let totalPrice = 0;

    // Add base prices from checkboxes
    document.querySelectorAll('#order-details input[type="checkbox"]:checked').forEach(checkbox => {
        totalPrice += parseFloat(checkbox.getAttribute('data-price'));
    });

    // Optionally, you could add price based on levels here if needed

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function sendOrderWithKeyboard(message, orderDetails) {
    const currentLevel = document.getElementById('currentLevel').value;
    const desiredLevel = document.getElementById('desiredLevel').value;
    const options = [
        { id: 'piloted', label: 'Piloted' },
        { id: 'selfplay', label: 'Selfplay' },
        { id: 'express', label: 'Express +€1.09' },
        { id: 'eternal', label: 'Eternal +€2.73' },
        { id: 'hardcore', label: 'Hardcore +€5.47' },
        { id: 'addMainCampaign', label: 'Add main campaign +€32' },
        { id: 'unlockTier', label: 'Unlock Tier 3 + Tier 4' },
        { id: 'battlePass', label: 'My Battle Pass is at lvl 28 -€0.82' },
        { id: 'stream', label: 'Stream +€7' }
    ];

    let selectedOptions = options.filter(option => document.getElementById(option.id).checked).map(option => option.label).join('\n');
    const fullMessage = `${message}\nCurrent Level: ${currentLevel}\nDesired Level: ${desiredLevel}\nOptions:\n${selectedOptions}\nTotal Price: €${document.getElementById('totalPrice').textContent}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: mainChatId,
        text: fullMessage,
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
            // Store the message_id and order details
            localStorage.setItem('orderMessageId', data.result.message_id);
            localStorage.setItem('orderDetails', orderDetails);
        } else {
            console.error(`Failed to send order options: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
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
        sendInitialMessage(callbackQuery.from.id);
    } else if (callbackQuery.data.startsWith('confirmOrder')) {
        const time = callbackQuery.data.split(':')[1];
        notifyAndDeleteOrder(callbackQuery.from.username, time);
    }
}

function sendInitialMessage(chatId) {
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
        if (!data.ok) {
            console.error(`Failed to send initial DM: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function notifyAndDeleteOrder(username, time) {
    const orderMessageId = localStorage.getItem('orderMessageId');
    const orderDetails = localStorage.getItem('orderDetails');
    
    if (!orderMessageId || !orderDetails) {
        console.error('Order message ID or order details not found');
        return;
    }

    // Send notification to another channel
    const notifyUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const notifyData = {
        chat_id: notificationChatId,
        text: `User @${username} can start at ${time}\nOrder Details: ${orderDetails}`
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
        if (data.ok) {
            // Delay the deletion of the initial order message by 2 seconds
            setTimeout(() => {
                deleteOrderMessage(orderMessageId);
            }, 2000);
        } else {
            console.error(`Failed to send notification: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteOrderMessage(messageId) {
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
        if (data.ok) {
            console.log('Order message deleted successfully');
        } else {
            console.error(`Failed to delete order message: ${data.description}`);
        }
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
        if (!data.ok) {
            console.error(`Failed to send DM: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
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
                    notifyAndDeleteOrder(username, time);
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
