const modal = document.getElementById('requirements-modal');
const openModal = () => {
    modal.showModal();
}
const closeModal = () => {
    modal.close();
}

window.addEventListener("load", () => {
    connectInputs();
    calculate();
})

let inputList = [];
const fanStart = document.getElementById('fan-start');
const crystalStart = document.getElementById('crystal-start');
const gearStart = document.getElementById('gear-start');
const tera = document.getElementById('tera');
const gearCost = document.getElementById('gear-cost');
const gearSell = document.getElementById('gear-sell');
const fanPrice = document.getElementById('fan-price');
const crystalPrice = document.getElementById('crystal-price');

let remainingFan;
let remainingCrystal;
let remainingGear;

const connectInputs = () => {    
    inputList.push(fanStart);
    inputList.push(crystalStart);
    inputList.push(gearStart);
    inputList.push(tera);
    inputList.push(gearCost);
    inputList.push(gearSell);
    inputList.push(fanPrice);
    inputList.push(crystalPrice);

    inputList.forEach(input => {
        input.addEventListener("input", () => updateValues(input));
        updateLabel(input);
    })
}

const updateLabel = (input) => {
    if(input.id == "fan-price") {
        const labelTera = document.getElementById("label-"+input.id+"-tera");
        const labelMega = document.getElementById("label-"+input.id+"-mega");

        labelTera.textContent = leadingZero(Math.floor(input.value));
        labelMega.textContent = leadingZero(Math.round((input.value % 1) * 1000));
        return;
    }
    const label = document.getElementById("label-"+input.id);
    label.textContent = leadingZero(input.value);
}

const updateValues = (input) => {
    updateLabel(input);
    calculate();
}

const calculate = () => {
    let value = parseFloat(tera.value);
    remainingFan = fanStart.value;
    remainingCrystal = crystalStart.value;
    remainingGear = gearStart.value;
    value = generateSection(1, value, 'buying');
    value = generateSection(1, value, 'crafting');
    value = generateSection(1, value, 'selling');
    value = generateSection(2, value, 'buying');
    value = generateSection(2, value, 'crafting');
    value = generateSection(2, value, 'selling');
    value = generateSection(3, value, 'buying');
    value = generateSection(3, value, 'crafting');
    value = generateSection(3, value, 'selling');
}

const generateSection = (id, value, type) => {
    const content = document.createElement('div');
    content.classList.add('content');
    let containerName = '';
    if(type == 'buying') {
        containerName = "out-bgp"+id;
        value = generateBuying(value, content);
    } else if (type == 'crafting') {
        containerName = "out-cgp"+id;
        value = generateCrafting(value, content);
    } else {
        containerName = "out-sgp"+id;
        value = generateSelling(value, content);
    }
    const container = document.getElementById(containerName);
    
    updateSummary(value, container);
    
    let oldContent = container.getElementsByClassName('content')[0];    
    if(oldContent) {
        oldContent.remove()
    }
    container.appendChild(content);

    return value;
}

const generateBuying = (value, container) => {
    let starting = value;
    let cost = parseFloat(gearCost.value);
    value = starting - cost;

    let row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <p class='result'>${buildMoney(starting - cost)} =</p>
        <p class="reason">Buying Fanglongmon's Utimate Accessory from another player</p>
        <p>${buildMoney(starting)} (Starting Amount) - ${buildMoney(cost)} (Gear Cost)</p>
    `;

    container.appendChild(row);
    return value;
}
const generateCrafting = (value, container) => {
    let calcValue = parseFloat(value);
    
    if(remainingCrystal > 0) {
        remainingCrystal -= 1;
    } else {
        let row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = `
            <p class='result'>${buildMoney(calcValue - 5 - parseFloat(crystalPrice.value))} = </p>
            <p class="reason">Craft Divine Accessory of Holy Beast</p>
            <p>
                ${buildMoney(calcValue)} (Starting Amount) 
                - ${buildMoney(5)} (Crafting Cost) 
                - ${buildMoney(parseFloat(crystalPrice.value))} (Divine Crystal Cost)
            </p>
        `;
        container.appendChild(row);

        calcValue = calcValue - 5 - parseFloat(crystalPrice.value);
    }

    if (remainingGear > 0) {
        remainingGear -= 1;
    } else {
        let fanAmount = useFanronkou(10)
        let fanUsed = fanAmount * parseFloat(fanPrice.value);
        let row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = `
            <p class='result'>${buildMoney(calcValue - fanUsed - 0.2)} =</p>
            <p class="reason">Craft Fanglongmon's Ancient Accessory [Lv.1]</p>
            <p>
                ${buildMoney(calcValue)} (Starting Amount) 
                - ${buildMoney(0.2)} (Crafting Cost) 
                - ${buildMoney(fanUsed)} (${fanAmount} Fanronkou bought)
            </p>
        `;
        container.appendChild(row);
        calcValue = calcValue - fanUsed - 0.2;        
    }

    let fanAmount = useFanronkou(100)
    let fanUsed = fanAmount * parseFloat(fanPrice.value);
    let row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <p class='result'>${buildMoney(calcValue - fanUsed - 5)} =</p>
        <p class="reason">Craft Fanglongmon's Ancient Accessory [Lv.10] using Voucher</p>
        <p>
            ${buildMoney(calcValue)} (Starting Amount) 
            - ${buildMoney(5)} (Crafting Cost) 
            - ${buildMoney(fanUsed)} (${fanAmount} Fanronkou bought)
        </p>
    `;
    container.appendChild(row);
    calcValue = calcValue - fanUsed - 5;

    let fanAmount2 = useFanronkou(20)
    let fanUsed2 = fanAmount2 * parseFloat(fanPrice.value);
    let row2 = document.createElement('div');
    row2.classList.add('row');
    row2.innerHTML = `
        <p class='result'>${buildMoney(calcValue - fanUsed2 - 1)} =</p>
        <p class="reason">Craft Ultimate Accessory to sell</p>
        <p>
            ${buildMoney(calcValue)} (Starting Amount) 
            - ${buildMoney(1)} (Crafting Cost) 
            - ${buildMoney(fanUsed2)} (${fanAmount2} Fanronkou bought)
        </p>
    `;
    container.appendChild(row2);
    calcValue = calcValue - fanUsed2 - 1;

    return calcValue;
}
const generateSelling = (value, container) => {
    let starting = value;
    let cost = parseFloat(gearSell.value);
    value = starting + cost;

    let row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <p class='result'>${buildMoney(starting + cost)} =</p>
        <p class="reason">Selling newly crafted Fanglongmon's Utimate Accessory to another player</p>
        <p>${buildMoney(starting)} (Starting Amount) + ${buildMoney(cost)} (Gear Selling Value)</p>
    `;

    container.appendChild(row);
    return value;
}

const updateSummary = (value, container) => {
    const labelTera = document.getElementById(container.id+"-tera");
    const labelMega = document.getElementById(container.id+"-mega");
    
    labelTera.textContent = leadingZero(ceilAwayFromZero(value));
    labelMega.textContent = leadingZero(Math.abs(Math.round((value % 1) * 1000)));

    if(value < 0) {
        container.classList.add('negative');
    } else {
        container.classList.remove('negative');
    }
}

const buildMoney = (value) => {
    let tera = ceilAwayFromZero(value);
    let mega = Math.abs(Math.round((value % 1) * 1000));

    return `
        <span>${leadingZero(tera)}</span><img src='/assets/Currency_Tera.webp'>
        <span>${leadingZero(mega)}</span><img src='/assets/Currency_Mega.webp'>
    `
}

const useFanronkou = (amount) => {
    if (remainingFan >= amount) {
        remainingFan -= amount;
        return 0;
    } else {
        let remainder = amount - remainingFan;
        remainingFan = Math.max(remainingFan - amount, 0);
        return remainder;
    }
}

const leadingZero = (val) => {
    if (val < -99) return val;
    let text = val.toString();
    let isNegative = val < 0;
    if(isNegative) {
        text = text.substring(1);
    }
    while (text.length < 3) {
        if(isNegative && text.length == 2) {
            text = "-"+text;
            continue;
        }
        text = "0"+text;
    }

    return text
}

const ceilAwayFromZero = (value) => {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
}