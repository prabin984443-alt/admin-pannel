/* admin.js */

const DB_URL = "https://elymind-v-8e53c-default-rtdb.firebaseio.com";

function show(id) {
    document.querySelectorAll('.admin-section').forEach(d => d.style.display='none');
    document.getElementById(id).style.display='block';
    if(id==='fire') loadQuests();
    if(id==='water') loadSounds();
    if(id==='data') loadData();
}

// --- FIRE ---
async function addQuest() {
    const text = document.getElementById('q-text').value;
    const tip = document.getElementById('q-tip').value;
    const cat = document.getElementById('q-cat').value;
    
    if(!text) return alert("Title required");
    
    await fetch(`${DB_URL}/quests.json`, { 
        method:'POST', 
        body:JSON.stringify({text, tip, category:cat}) 
    });
    alert("Quest Added"); document.getElementById('q-text').value=''; loadQuests();
}

async function loadQuests() {
    const res = await fetch(`${DB_URL}/quests.json`);
    const data = await res.json();
    const list = document.getElementById('q-list');
    list.innerHTML = '';
    if(data) Object.entries(data).reverse().forEach(([k,v]) => {
        list.innerHTML += `<div class="data-row"><span>${v.text} <small>(${v.category})</small></span> <button onclick="del('quests/${k}','fire')" style="color:#ff5252; background:none; border:1px solid #ff5252; padding:5px;">Delete</button></div>`;
    });
}

// --- WATER (List All & Delete) ---
async function addSound() {
    const name = document.getElementById('s-name').value;
    const url = document.getElementById('s-url').value;
    const mood = document.getElementById('s-mood').value;
    if(!name || !url) return alert("Fields required");

    await fetch(`${DB_URL}/emosync_sounds.json`, { 
        method:'POST', 
        body:JSON.stringify({name, url, category:mood}) 
    });
    alert("Sound Added"); loadSounds();
}

async function loadSounds() {
    const res = await fetch(`${DB_URL}/emosync_sounds.json`);
    const data = await res.json();
    const list = document.getElementById('s-list');
    list.innerHTML = '';
    // Show ALL tracks
    if(data) Object.entries(data).reverse().forEach(([k,v]) => {
        list.innerHTML += `<div class="data-row"><span>${v.name} <small>[${v.category}]</small></span> <button onclick="del('emosync_sounds/${k}','water')" style="color:#ff5252; background:none; border:1px solid #ff5252; padding:5px;">Delete</button></div>`;
    });
}

// --- DATA HUB ---
async function loadData() {
    // Breath Logs
    const bRes = await fetch(`${DB_URL}/breathing_logs.json`);
    const bData = await bRes.json();
    const bDiv = document.getElementById('log-breath');
    bDiv.innerHTML = '';
    if(bData) Object.values(bData).reverse().forEach(v => bDiv.innerHTML += `<div class="data-row" style="display:block;">${v.date}<br><b style="color:#81d4fa;">${v.type}</b></div>`);

    // Schedule Logs
    const sRes = await fetch(`${DB_URL}/schedule_logs.json`);
    const sData = await sRes.json();
    const sDiv = document.getElementById('log-schedule');
    sDiv.innerHTML = '';
    if(sData) Object.values(sData).reverse().forEach(v => sDiv.innerHTML += `<div class="data-row" style="display:block;">${v.date}<br><b style="color:#81c784;">${v.task}</b> (${v.time})</div>`);
}

async function del(path, section) {
    if(confirm("Delete this item?")) {
        await fetch(`${DB_URL}/${path}.json`, {method:'DELETE'});
        if(section === 'fire') loadQuests();
        if(section === 'water') loadSounds();
    }
}

// Init
loadQuests();