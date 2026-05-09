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
                setTimeout(() => {
                    img.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }, 100);
            }

            img.onclick = function () {
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

// Draw the locks!
initScrollLocks();

// --- QUESTIONS DATA ---
const questionsData = {
    fresher: [
        "Looking at the intro cinematic, what was the very first object that made you think, 'I’m in trouble'?",
        "Which Survivor on the character screen looks like they’d be the first to die in a real horror movie?",
        "What was the name of the friend (or the streamer) who finally convinced/tricked you into downloading this?",
        "When you first saw the campfire on the main menu, what was the first 'vibe' or emotion you felt?",
        "Which Killer icon in the store looks the most like a nightmare you’ve actually had?"
    ],
    beginner: [
        "What was the first Killer power that actually made you jump in real life?",
        "Which Survivor did you pick first simply because they looked like you or someone you know?",
        "What is the name of the first Perk you read and thought, 'This is definitely over-powered'?",
        "Which map’s atmosphere did you find the most confusing to navigate during your first week?",
        "What was the 'noob' mistake you made for the longest time before someone corrected you?"
    ],
    intermediate: [
        "Which Perk do you always keep in your 'emotional support' build, even if it isn't meta?",
        "What is your go-to strategy when you realize the Killer is a 'Scratch Mirror' Myers?",
        "Which specific Jungle Gym or tile shape do you feel most confident looping in?",
        "What is the most frustrating way you’ve ever seen a teammate use a Pallet?",
        "Which Killer do you find the most rewarding to 'dodge' or 'spin'?"
    ],
    pro: [
        "Which specific 'Checkspot' on a MacMillan map do you prioritize holding against a high-mobility Killer?",
        "What is your personal name for the 'Tech' you use that isn't officially recognized by the devs?",
        "Which Killer’s 'lunge distance' do you have memorized to the millisecond?",
        "What is the most obscure 'Sound Cue' you use to track a Survivor without using any tracking perks?",
        "Which frame-perfect interaction do you fail most often despite being a pro?"
    ]
};

// --- HANDLE QUESTIONS DROPDOWN ---
document.getElementById('categorySelect').addEventListener('change', function (e) {
    const category = e.target.value;
    const questionSelect = document.getElementById('questionSelect');

    questionSelect.innerHTML = '<option value="" disabled selected>Choose your secret question...</option>';

    if (category && questionsData[category]) {
        questionsData[category].forEach(question => {
            const option = document.createElement('option');
            option.value = question;
            option.textContent = question;
            questionSelect.appendChild(option);
        });
        questionSelect.disabled = false;
    }
});

// --- HANDLE FORM SUBMISSION ---
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const statusMsg = document.getElementById('statusMessage');
    statusMsg.style.color = 'white';
    statusMsg.textContent = "Summoning The Entity...";

    const sacrificeName = document.getElementById('sacrificeName').value.trim();
    const category = document.getElementById('categorySelect').value;
    const secretQuestion = document.getElementById('questionSelect').value;
    const secretAnswer = document.getElementById('secretAnswer').value.trim();
    
    // FIXED: Using supabaseClient instead of supabase
    const { data, error } = await supabaseClient
        .from('sacrifices')
        .insert([
            {
                sacrifice_name: sacrificeName,
                combo_1: lockState[0],
                combo_2: lockState[1],
                secret_category: category,
                secret_question: secretQuestion,
                secret_answer: secretAnswer
            }
        ]);

    if (error) {
        console.error('Error:', error);
        statusMsg.style.color = '#ff3333';
        if (error.code === '23505') {
            statusMsg.textContent = "This Sacrifice Name is already taken!";
        } else {
            statusMsg.textContent = "The Entity rejected your offering. Check console.";
        }
    } else {
        statusMsg.style.color = '#33ff33';
        statusMsg.textContent = "Sacrifice Accepted! You are now registered.";
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
});
