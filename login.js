// --- DATABASE SETUP ---
const SUPABASE_URL = 'https://snihsgtulbtnwjyrhman.supabase.co'; // Add your URL here
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaWhzZ3R1bGJ0bndqeXJobWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODU1NzIsImV4cCI6MjA5Mzg2MTU3Mn0.Wru5wr8p9HcdZpwZ_msYYfhIomd4iLiYW1N4EC6E25Q'; // Add your Key here

// FIXED: Renamed to 'supabaseClient' to prevent naming collision
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- PERKS DATA ---
const perks = [
    "IconPerks_aceInTheHole.webp", "IconPerks_adrenaline.webp", "IconPerks_aftercare.webp",
    "IconPerks_agitation.webp", "IconPerks_alert.webp", "IconPerks_alienInstinct.webp",
    "IconPerks_aNursesCalling.webp", "IconPerks_appraisal.webp", "IconPerks_autodidact.webp",
    "IconPerks_babysitter.webp", "IconPerks_balancedLanding.webp", "IconPerks_bamboozle.webp"
];

let lockState = [perks[0], perks[0]];

// --- 1. RENDER VISUALS FIRST ---
function initScrollLocks() {
    const lockContainer = document.getElementById('combinationLock');
    if (!lockContainer) return;
    
    lockContainer.innerHTML = ''; 
    
    for (let i = 0; i < 2; i++) {
        const slotContainer = document.createElement('div');
        slotContainer.className = 'scroll-slot';
        
        perks.forEach((perkFile) => {
            const img = document.createElement('img');
            img.src = `DBDperks/${perkFile}`; 
            img.className = 'perk-option';
            
            if (perkFile === lockState[i]) {
                img.classList.add('selected');
            }
            
            img.onclick = function() {
                lockState[i] = perkFile;
                const allImagesInSlot = slotContainer.querySelectorAll('.perk-option');
                allImagesInSlot.forEach(image => image.classList.remove('selected'));
                img.classList.add('selected');
            };
            
            slotContainer.appendChild(img);
        });
        
        lockContainer.appendChild(slotContainer);
    }
}

// Draw the locks immediately!
initScrollLocks();


// --- STEP 1: FETCH QUESTION FROM DATABASE ---
document.getElementById('btnReveal').addEventListener('click', async function() {
    const statusMsg = document.getElementById('statusMessage');
    const sacrificeName = document.getElementById('sacrificeName').value.trim();
    const authSteps = document.getElementById('authSteps');
    const questionDisplay = document.getElementById('theSecretQuestion');

    if (!sacrificeName) {
        statusMsg.style.color = '#ff3333';
        statusMsg.textContent = "You must enter a name first.";
        return;
    }

    statusMsg.style.color = 'white';
    statusMsg.textContent = "Searching the records...";

    // FIXED: Using supabaseClient instead of supabase
    const { data, error } = await supabaseClient
        .from('sacrifices')
        .select('secret_question')
        .eq('sacrifice_name', sacrificeName);

    if (error) {
        console.error(error);
        statusMsg.style.color = '#ff3333';
        statusMsg.textContent = "Database error occurred.";
    } else if (data && data.length > 0) {
        statusMsg.textContent = "";
        questionDisplay.textContent = data[0].secret_question;
        authSteps.style.display = 'block';
        
        document.getElementById('sacrificeName').readOnly = true;
        document.getElementById('btnReveal').style.display = 'none';
        
        // Re-initialize locks just in case
        initScrollLocks();
    } else {
        statusMsg.style.color = '#ff3333';
        statusMsg.textContent = "No record found for that name. The Entity does not know you.";
        authSteps.style.display = 'none';
    }
});

// --- STEP 2: HANDLE FINAL LOGIN SUBMISSION ---
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusMsg = document.getElementById('statusMessage');
    statusMsg.style.color = 'white';
    statusMsg.textContent = "Verifying your soul...";

    const sacrificeName = document.getElementById('sacrificeName').value.trim();
    const secretAnswer = document.getElementById('secretAnswer').value.trim();
    
    // FIXED: Using supabaseClient instead of supabase
    const { data, error } = await supabaseClient
        .from('sacrifices')
        .select('*')
        .eq('sacrifice_name', sacrificeName)
        .eq('secret_answer', secretAnswer)
        .eq('combo_1', lockState[0])
        .eq('combo_2', lockState[1]);

    if (error) {
        console.error('Error:', error);
        statusMsg.style.color = '#ff3333';
        statusMsg.textContent = "Connection severed.";
    } else if (data && data.length > 0) {
        statusMsg.style.color = '#33ff33';
        statusMsg.textContent = `Credentials verified. Welcome back, ${sacrificeName}...`;
        
        // --- ADD THESE TWO LINES ---
        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem('currentUser', sacrificeName); 
        
        setTimeout(() => {
            window.location.href = 'Challenges.html'; 
        }, 1500);
    } else {
        statusMsg.style.color = '#ff3333';
        statusMsg.textContent = "Incorrect Answer or Perk Combination.";
    }
});
