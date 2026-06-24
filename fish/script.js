let inventory = [];
let money = 0;

let reeling = false;
let progress = 0;
let interval;

/* ---------------- FISH TYPES ---------------- */

const fishTypes = [
    { name: "Carp", value: 10 },
    { name: "Trout", value: 15 },
    { name: "Bass", value: 20 },
    { name: "Salmon", value: 35 },
    { name: "Pike", value: 40 },
    { name: "Golden Carp", value: 120 }
];

/* ---------------- UPGRADES ---------------- */

let upgrades = {
    rod: 1,
    bait: 1,
    reel: 1,
    helper: 0
};

let shopOpen = false;

/* ---------------- EXPENSIVE PRICE SCALING ---------------- */
/* (THIS IS THE BIG CHANGE) */

function rodPrice(){
    return Math.floor(200 * Math.pow(2.4, upgrades.rod));
}

function baitPrice(){
    return Math.floor(300 * Math.pow(2.6, upgrades.bait));
}

function reelPrice(){
    return Math.floor(450 * Math.pow(2.8, upgrades.reel));
}

function helperPrice(){
    return Math.floor(2000 * Math.pow(3.5, upgrades.helper + 1));
}

/* ---------------- SHOP ---------------- */

function toggleShop(){
    shopOpen = !shopOpen;
    document.getElementById("shop").style.display = shopOpen ? "block" : "none";
    renderShop();
}

function renderShop(){
    const shop = document.getElementById("shop");

    shop.innerHTML = `
        <div class="shopItem" onclick="buyRod()">
            🎣 Rod Lv ${upgrades.rod} - $${rodPrice()}
        </div>

        <div class="shopItem" onclick="buyBait()">
            🪱 Bait Lv ${upgrades.bait} - $${baitPrice()}
        </div>

        <div class="shopItem" onclick="buyReel()">
            🤏 Reel Lv ${upgrades.reel} - $${reelPrice()}
        </div>

        <div class="shopItem" onclick="buyHelper()">
            🤖 Helper Lv ${upgrades.helper} - $${helperPrice()}
        </div>
    `;
}

/* ---------------- BUY ---------------- */

function buyRod(){
    let cost = rodPrice();
    if(money < cost) return;

    money -= cost;
    upgrades.rod++;
    updateUI();
}

function buyBait(){
    let cost = baitPrice();
    if(money < cost) return;

    money -= cost;
    upgrades.bait++;
    updateUI();
}

function buyReel(){
    let cost = reelPrice();
    if(money < cost) return;

    money -= cost;
    upgrades.reel++;
    updateUI();
}

function buyHelper(){
    let cost = helperPrice();
    if(money < cost) return;

    money -= cost;
    upgrades.helper++;
    updateUI();
}

/* ---------------- SPAWN ---------------- */

const MAX_FISH = 2;
let lastSpawn = 0;

function spawnFish(){
    const now = Date.now();
    if(now - lastSpawn < 2000) return;

    const river = document.getElementById("river");
    if(river.children.length >= MAX_FISH) return;

    lastSpawn = now;

    const fish = document.createElement("div");
    fish.className = "fish";

    fish.style.top = (Math.random() * 80 + 10) + "vh";

    let speed = Math.random() * 4 + 5;
    fish.style.animationDuration = speed + "s";

    fish.onclick = () => hookFish(fish);

    river.appendChild(fish);

    setTimeout(() => fish.remove(), speed * 1000);
}

/* ---------------- REEL ---------------- */

function hookFish(fish){
    if(reeling) return;

    fish.remove();
    startReel();
}

function startReel(){
    reeling = true;
    progress = 0;

    document.getElementById("reelUI").style.display = "block";

    interval = setInterval(() => {
        let decay = 0.7 - (upgrades.reel * 0.12);
        if(decay < 0.1) decay = 0.1;

        progress -= decay;
        if(progress < 0) progress = 0;

        document.getElementById("fill").style.width = progress + "%";
    }, 50);
}

/* ---------------- CLICK REEL ---------------- */

document.addEventListener("click", (e) => {
    if(e.target.tagName === "BUTTON") return;

    if(reeling){
        progress += 5;

        if(progress >= 100){
            catchFish();
        }
    }
});

/* ---------------- CATCH ---------------- */

function catchFish(){
    clearInterval(interval);
    reeling = false;

    document.getElementById("reelUI").style.display = "none";

    let fish = fishTypes[Math.floor(Math.random() * fishTypes.length)];

    let multiplier = 1 + (upgrades.rod * 0.25);
    fish.value = Math.floor(fish.value * multiplier);

    inventory.push(fish);

    if(inventory.length > 20){
        inventory.shift();
    }

    updateUI();
}

/* ---------------- SELL ---------------- */

const SELL_COOLDOWN = 2 * 60 * 1000;
let lastSellTime = 0;

function canSell(){
    return Date.now() - lastSellTime >= SELL_COOLDOWN;
}

function formatTime(ms){
    let mins = Math.floor(ms / 60000);
    let secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
}

function sellFish(){
    if(!canSell()) return;

    let earnings = 0;

    for(let f of inventory){
        earnings += f.value;
    }

    money += earnings;
    inventory = [];

    lastSellTime = Date.now();

    updateUI();
}

/* ---------------- SELL BUTTON ---------------- */

function updateSellButton(){
    const btn = document.getElementById("sellBtn");
    if(!btn) return;

    let left = SELL_COOLDOWN - (Date.now() - lastSellTime);

    if(left <= 0){
        btn.innerText = "Sell Fish";
        btn.disabled = false;
    } else {
        btn.innerText = `Sell again in ${formatTime(left)}`;
        btn.disabled = true;
    }
}

/* ---------------- HELPER ---------------- */

setInterval(() => {
    if(upgrades.helper <= 0) return;

    if(reeling){
        progress += upgrades.helper * 0.8;

        if(progress >= 100){
            catchFish();
        }
    }
}, 100);

/* ---------------- BASKET UI (NEW) ---------------- */

function getBasketValue(){
    return inventory.reduce((sum, f) => sum + f.value, 0);
}

/* ---------------- UI ---------------- */

function updateUI(){
    document.getElementById("money").innerText = money;

    let invBox = document.getElementById("invBox");

    if(!invBox){
        invBox = document.createElement("div");

        invBox.id = "invBox";
        invBox.style.position = "absolute";
        invBox.style.right = "15px";
        invBox.style.bottom = "15px";
        invBox.style.width = "220px";
        invBox.style.background = "rgba(0,0,0,0.55)";
        invBox.style.padding = "12px";
        invBox.style.borderRadius = "10px";
        invBox.style.color = "white";
        invBox.style.fontSize = "12px";
        invBox.style.maxHeight = "250px";
        invBox.style.overflowY = "auto";
        invBox.style.border = "1px solid #1f2a38";

        document.body.appendChild(invBox);
    }

    let basketValue = getBasketValue();

    invBox.innerHTML = `
        <b>🎒 Basket</b><br>
        Fish: ${inventory.length} / 20<br>
        Value: 💰 ${basketValue}<br><br>

        ${inventory.length
            ? inventory.map(f => `🐟 ${f.name} (+${f.value})`).join("<br>")
            : "Empty basket"}
    `;

    updateSellButton();
    renderShop();
}

/* ---------------- LOOP ---------------- */

setInterval(spawnFish, 1000);
setInterval(updateSellButton, 1000);

updateUI();