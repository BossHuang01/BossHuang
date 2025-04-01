const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const result = document.getElementById('result');
const history = document.getElementById('history');
const numberElements = result.querySelectorAll('.number');

let isRunning = false;
let rollingInterval;
let finalNumbers = [];

function generateRandomNumber(index) {
    if (index === 0) {
        return Math.floor(Math.random() * 9) + 1; // Ensure the first number is not zero
    }
    return Math.floor(Math.random() * 10);
}

function updateDisplay(number, index, isRolling = false) {
    numberElements[index].textContent = number;
    numberElements[index].classList.toggle('rolling', isRolling);
}

function showButton(button, show) {
    button.style.display = show ? 'inline-block' : 'none';
    button.disabled = !show;
}

function startLottery() {
    if (isRunning) return;
    isRunning = true;
    finalNumbers = [];
    showButton(startBtn, false);
    showButton(stopBtn, false);

    // Clear any existing intervals
    clearInterval(rollingInterval);

    // Start continuous random numbers for all digits
    rollingInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            updateDisplay(generateRandomNumber(i), i, true);
        }
    }, 50);

    // Enable stop button after 1.5 seconds
    setTimeout(() => {
        showButton(stopBtn, true);
    }, 1500);
}

function stopLottery() {
    if (!isRunning || stopBtn.disabled) return;
    isRunning = false;

    // Stop all continuous intervals
    clearInterval(rollingInterval);

    // Generate final numbers and stop rolling effect
    finalNumbers = Array.from({ length: 5 }, (_, i) => generateRandomNumber(i));
    finalNumbers.forEach((number, index) => {
        updateDisplay(number, index, false);
    });

    showButton(stopBtn, false);
    showButton(startBtn, true);

    const historyItem = document.createElement('div');
    historyItem.innerHTML = `${new Date().toLocaleString()} 开奖结果：${finalNumbers.join(' ')}`;

    // Add new item to the top
    history.prepend(historyItem);

    // Remove oldest item if there are more than 5 items
    if (history.children.length > 5) {
        const lastItem = history.lastChild;
        lastItem.classList.add('fade-out');
        setTimeout(() => {
            lastItem.remove();
        }, 500);
    }

    // Enable save button if there are at least 5 results
    if (history.children.length >= 5) {
        showButton(saveBtn, true);
    }
}

function saveResults() {
    // Get the content of the history section as plain text
    const historyContent = history.innerText.split('\n').filter(line => line.trim());

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set initial canvas dimensions
    canvas.width = 600;
    canvas.height = 400;

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font style for title
    ctx.font = '24px Arial';
    ctx.fillStyle = '#333333';

    // Title
    const title = "排列5机选开奖历史记录";
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (canvas.width - titleWidth) / 2, 50);

    // Set font style for wish message
    ctx.font = '20px Arial';
    ctx.fillStyle = '#e74c3c'; // Red color

    // Wish message
    const wishMessage = "祝您中大奖！";
    const wishWidth = ctx.measureText(wishMessage).width;
    ctx.fillText(wishMessage, (canvas.width - wishWidth) / 2, 80);

    // Set font style for main history lines
    ctx.font = '24px Arial'; // Larger font size for history records
    ctx.fillStyle = '#666666';

    // Calculate total height needed for all lines
    const lineHeight = 36;
    const totalHistoryHeight = historyContent.length * lineHeight;

    // Calculate position to center the history content
    const centerX = canvas.width / 2;
    const startY = 120;
    let yPosition = startY;

    // Draw each line of history on the canvas and center it
    historyContent.forEach((line, index) => {
        const textWidth = ctx.measureText(line).width;
        ctx.fillText(line, centerX - textWidth / 2, yPosition);
        yPosition += lineHeight;
    });

    // Add copyright information and disclaimer
    const copyrightInfo = "张掖123上网导航网 zhangye123.com";
    const disclaimer = "彩票开奖结果为随机产生，并不代表最终结果！";

    // Measure text widths
    const copyrightWidth = ctx.measureText(copyrightInfo).width;
    const disclaimerWidth = ctx.measureText(disclaimer).width;

    // Calculate positions to center the texts
    const copyrightY = canvas.height - 60;
    const disclaimerY = canvas.height - 30;

    // Draw copyright information
    ctx.fillText(copyrightInfo, centerX - copyrightWidth / 2, copyrightY);

    // Draw disclaimer
    ctx.fillText(disclaimer, centerX - disclaimerWidth / 2, disclaimerY);

    // Convert canvas to image data URL
    const imgData = canvas.toDataURL('image/png');

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'lottery_results.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

startBtn.addEventListener('click', startLottery);
stopBtn.addEventListener('click', stopLottery);
saveBtn.addEventListener('click', saveResults);