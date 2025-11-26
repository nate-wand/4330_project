import { onAuthStateChanged, updateDoc, getDoc, doc, db, auth, signOut, getToken, messaging, setDoc, onMessage, increment, setPersistence, browserSessionPersistence, browserLocalPersistence } from "./firebase-init.js";

let bottom_bar = document.querySelector('.bottom-bar');
let message_area = document.querySelector('.message-area');
let user_input = document.querySelector('.user-input');
let fake_user_input = document.querySelector('.fake-user-input');
let input_container = document.querySelector('.input-container');
let top_bar = document.querySelector('.top-bar');
let input_button = document.querySelector('.input-button');
let chat_history_button = document.querySelector('.chat-history-button');
let close_chat_history_button = document.querySelector('.close-chat-history-button');
let account_logout_button = document.querySelector('.account-logout-button');
let user_chat_history_container = document.querySelector('.user-chat-history-container');
let close_profile_logout_button = document.querySelector('.close-profile-logout-button');
let profile_info_logout_container = document.querySelector('.profile-info-logout-container');
let chat_history_prompts_container = document.querySelector('.chat-history-prompts-container');
let new_chat_button = document.querySelector('.new-chat-button');
let logout_button = document.querySelector('.logout-button');
let profile_logout_username_text = document.querySelector('.profile-logout-username-text');
let stop_button = document.querySelector('.stop-button');
let open_question_button_container = document.querySelector('.open-question-button-container');
let open_question_button = document.querySelector('.open-question-button');
let notification_soft_prompt_container = document.querySelector('.notification-soft-prompt-container');
let reject_button = document.querySelector('.reject-button');
let accept_button = document.querySelector('.accept-button');
let color_selector_button = document.querySelector('.color-selector')

let API_KEY = '';
let API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const PUBLIC_KEY = 'BAHlmlz8s50w0M4xgNet4fLXU3-_7qrmwjN4Qluk3vl2DrMkh_P919ty7eVaRzyhHjMLQ8SrL4iOTiOVmKTM-yI';

let typing_interval, abort_controller;
let knowledge_base = {
  parts: [{
    text: ''

  },
  {
    text: 'Keep responses under 200 tokens. Finish your thoughts completely. Do not answer previous questions when given a new user prompt.'

  }]

};
let content_log = [];
let user_data = {
  message: ''

};
let is_first_prompt = true;
let modified_user_chat_history = [];
let last_user_id = null;

const DAILY_NOTIFICATION_TIME_UTC = { hour: 23, minute: 0 };

async function execute_daily_function() {
  let user = auth.currentUser;
  let lesson_otd = '';
  
  if (!user) return;

  let user_doc_ref = doc(db, 'users', user.uid);

  let doc_snap = await getDoc(user_doc_ref);
  let user_data = doc_snap.exists() ? doc_snap.data() : {};

  const logged = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (user_data.last_date_sent === logged) return;

  console.log('🎉 Executing daily logic!');
  
  await wait_for_ai_idle();

  switch (user_data.day) {
    case 0:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 1's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Stress is a common response to pressure. It signals that the body and mind are preparing to handle a demand. A brief breathing exercise can lower arousal and create space for clearer choices. The 4-7-8 method uses a steady rhythm to slow the breath and can be completed in under a minute.\n\n
        **Micro-action (≤2 min):**\n\n
        1. Sit upright, shoulders relaxed.
        2. Inhale through the nose for 4 seconds.
        3. Hold for 7 seconds.
        4. Exhale through the mouth for 8 seconds.
        5. Repeat for 3 cycles.\n\n
        **Follow-up prompt:** "Will you try 3 cycles now?"
      `;
      await setDoc(user_doc_ref, { day: 1 }, { merge: true });
      break;
    
    case 1:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 2's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        When attention is pulled into worries, grounding can redirect focus to the present. The 5-4-3-2-1 method uses the senses to anchor awareness. It does not remove problems; it helpsreduce the immediate surge so tasks can be approached more steadily.\n\n 
        **Micro-action (≤2 min):**\n\n 
        Identify: 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste (or a slow sip of water). Breathe normally while naming each item.\n\n
        **Follow-up prompt:** “Would you like to run one grounding cycle now?”
      `;
      await setDoc(user_doc_ref, { day: 2 }, { merge: true });
      break;

    case 2:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 3's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Automatic thoughts can amplify stress. A quick appraisal can improve accuracy. The sequence is: catch the thought, check the evidence for and against it, and choose a more balanced statement. This does not require forced positivity; it aims for a realistic view.\n\n
        **Micro-action (≤2 min):**\n\n
        1. Write one stressful thought in a short sentence.
        2. List one fact supporting it and one fact against it.
        3. Rewrite a balanced alternative (e.g., “This is difficult, and I can take one step”).\n\n
        **Follow-up prompt:** “Do you want to draft one balanced statement now?”
      `;
      await setDoc(user_doc_ref, { day: 3 }, { merge: true });
      break;

    case 3:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 4's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Low mood often reduces activity, which can further lower mood. A brief, planned activity can interrupt this cycle. The goal is a small, achievable step that provides either pleasure or a sense of progress.\n\n 
        **Micro-action (≤2 min):**\n\n
        1. Choose one 10-minute activity (walk, stretch, tidy a surface, prepare a snack, message a friend).
        2. Schedule it for today and set a reminder.
        3. After completion, mark it done.\n\n
        **Follow-up prompt:** “Which 10-minute activity will you schedule today?”
      `;
      await setDoc(user_doc_ref, { day: 4 }, { merge: true });
      break;

    case 4:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 5's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        A consistent pre-sleep routine helps the body recognize it is time to rest. Brief actions thatlower stimulation can support sleep quality. The aim is to repeat a simple sequence at roughly the same time each night.\n\n
        **Micro-action (≤2 min to set up):**\n\n
        Pick two steps for tonight (examples: dim lights, silence notifications, light stretch, slow breathing, note tomorrow’s top task).
        Set a 10-minute “wind-down” reminder.\n\n
        **Follow-up prompt:** “Which two steps will you include in tonight’s wind-down?”
      `;
      await setDoc(user_doc_ref, { day: 5 }, { merge: true });
      break;

    case 5:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 6's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Actions aligned with personal values can stabilize motivation. Identifying one value and taking a small step toward it can improve direction without requiring large changes.\n\n
        **Micro-action (≤2 min):**\n\n
        1. Select one value from this list: health, learning, family, community, creativity, reliability.
        2. Define one 5-minute action consistent with it (e.g., read one page, send one check-in text).
        3. Plan when you will do it today.\n\n
        **Follow-up prompt:** “Which value and 5-minute action will you choose?”
      `;
      await setDoc(user_doc_ref, { day: 6 }, { merge: true });
      break;

    case 6:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 7's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Reviewing the past week helps identify what was useful. Selecting a small set of tools and scheduling them increases follow-through. The goal is to continue with methods that fit your context.\n\n
        **Micro-action (≤2 min):**\n\n
        1. Pick any two exercises to keep (e.g., 4-7-8, grounding, thought check, 10-minute activity, wind-down, values step).
        2. Choose specific times you will use them next week.
        3. Set reminders.\n\n
        **Follow-up prompt:** “Which two tools will you carry forward, and when will you use them?”
      `;
      await setDoc(user_doc_ref, { day: 7 }, { merge: true });
      break;

    case 7:
      lesson_otd = `Tell the user this using this layout:
        **Welcome to Day 1's lesson.**\n\n
        Please remember to fill out the questionnaire after your
        interaction with the app for the day.\n\n
        **Lesson:**\n\n
        Stress is a common response to pressure. It signals that the body and mind are preparing to handle a demand. A brief breathing exercise can lower arousal and create space for clearer choices. The 4-7-8 method uses a steady rhythm to slow the breath and can be completed in under a minute.\n\n
        **Micro-action (≤2 min):**\n\n
        1. Sit upright, shoulders relaxed.
        2. Inhale through the nose for 4 seconds.
        3. Hold for 7 seconds.
        4. Exhale through the mouth for 8 seconds.
        5. Repeat for 3 cycles.\n\n
        **Follow-up prompt:** "Will you try 3 cycles now?"
      `;
      await setDoc(user_doc_ref, { day: 1 }, { merge: true });
      break;

  }

  await handle_input(true, lesson_otd);
  
  await setDoc(user_doc_ref, { last_date_sent: logged }, { merge: true });
  
}

async function has_daily_time_passed() {
  let user = auth.currentUser;
  
  if (!user) return;

  let user_doc_ref = doc(db, 'users', user.uid);

  let doc_snap = await getDoc(user_doc_ref);
  let user_data = doc_snap.exists() ? doc_snap.data() : {};

  let reset = user_data.reset;

  let today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (today !== reset) {
    await setDoc(user_doc_ref, { reset: today }, { merge: true });
    return true;

  } else {
    return false;

  }

}

let daily_check_interval = null;

async function start_daily_check() {
  if (daily_check_interval) clearInterval(daily_check_interval);

  daily_check_interval = setInterval(async () => {
    console.log(await has_daily_time_passed())
    if (await has_daily_time_passed()) {
      open_question_button_container.style.display = 'flex';
      await execute_daily_function();
    }
  }, 60000);

  if (await has_daily_time_passed()) {
    open_question_button_container.style.display = 'flex';
    await execute_daily_function();
  
  }
}

function stop_daily_check() {
  console.log("in:" + daily_check_interval);
  if (daily_check_interval) {
    clearInterval(daily_check_interval);
    daily_check_interval = null;
  }
}


async function send_user_notification(playerId) {
  const response = await fetch("https://4330-welcome-message.pmnair04.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ playerId: playerId })
  });

  if (!response.ok) {
    console.error("Error sending notification:", await response.text());
  } else {
    console.log("Welcome notification sent ✅");
  }
}

// async function send_notification(count) {
//   const response = await fetch("https://onesignal.com/api/v1/notifications", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "Authorization": "Basic os_v2_app_dadgmcezgndp3lwlt6fzyev7ycmfjpdvsznupifwyew44owavmhrxkaudnex7lrcsxxpszvjdkzs3fmi6gxtbw2uukbb5jidq4o6poa"
//     },
//     body: JSON.stringify({
//       app_id: "18066608-9933-46fd-aecb-9f8b9c12bfc0",
//       filters: [
//         { field: "tag", key: "role", relation: "=", value: "admin" }
//       ],
//       headings: { en: "API Requests" },
//       contents: { en: `${count}/200` }
//     })
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Error sending notification:", errorText);
//   } else {
//     console.log("Notification sent successfully");
//   }
// }

const get_pacific_time = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',

  });

  return formatter.format(new Date());

};

const increment_rpd_counter = async () => {
  let today = get_pacific_time();
  let rpd_counter_ref = doc(db, 'rpd_counter', 'counter');
  let rpd_counter_ref_snapshot = await getDoc(rpd_counter_ref);

  if (rpd_counter_ref_snapshot.exists()) {
    let data = rpd_counter_ref_snapshot.data();
    let last_reset_date = data.last_reset_date;

    if (last_reset_date !== today) {
      await updateDoc(rpd_counter_ref, {
        count: 1,
        last_reset_date: today

      });

    } else {
      await updateDoc(rpd_counter_ref, {
        count: increment(1)

      });

    }

  }

};

const get_rpd_count = async () => {
  let rpd_counter_ref = doc(db, 'rpd_counter', 'counter');
  let rpd_counter_ref_snapshot = await getDoc(rpd_counter_ref);

  if (rpd_counter_ref_snapshot.exists()) {
    let data = rpd_counter_ref_snapshot.data();
    return data.count;

  }

};

chat_history_prompts_container.addEventListener('click', (e) => {
  e.preventDefault();

  document.querySelectorAll('.chat-history-prompt').forEach(prompt => {
    prompt.classList.remove('prompt-selected');

  });

  let chat_history_prompt_text = e.target.closest('.chat-history-prompt-text');

  if (!chat_history_prompt_text) {
    return;

  }

  let chat_history_prompt = chat_history_prompt_text.closest('.chat-history-prompt');
  chat_history_prompt?.classList.add('prompt-selected');

  user_chat_history_container.style.opacity = '0';
  user_chat_history_container.style.transform = 'translateX(-100%)';
  bottom_bar.style.pointerEvents = 'auto';
  app_container.classList.remove('not-in-use');
  abort_controller?.abort();
  clearInterval(typing_interval);
  document.body.classList.remove('ai-responding');
  setTimeout(() => {
    is_first_prompt = false;
    content_log = [];
    user_data = {
      message: ''

    };

    message_area.innerHTML = '';
    let conversation_string = '';

    console.log('modified_user_chat_history:', modified_user_chat_history);

    for (let conversation of modified_user_chat_history) {
      if (chat_history_prompt_text.textContent.trim() === conversation.user[0].trim() || chat_history_prompt_text.textContent.trim() === conversation.ai[0].trim()) {
        for (let i = 0; i < Math.max(conversation.user.length, conversation.ai.length); i++) {
          if (conversation.user[i] && conversation.user[i] !== '') {
            conversation_string += `<div class="user-message"><p class="user-text">${conversation.user[i]}</p></div>`;

          }
          if (conversation.ai[i]) {
            const formattedAiText = formatTextWithBold(conversation.ai[i]);
            conversation_string += `<div class="ai-message"><p class="ai-text">${formattedAiText}</p></div>`;

          }

        }

        break;

      }

    };

    message_area.innerHTML = conversation_string;
    setTimeout(() => {
      scroll_to_bottom();

    }, 200);

  }, 30);


});

chat_history_button.addEventListener('click', (e) => {
  e.preventDefault();

  user_chat_history_container.style.opacity = '1';
  user_chat_history_container.style.transform = 'translateX(0%)';

  if (window.getComputedStyle(profile_info_logout_container).display !== 'none') {
    close_profile_logout_button.click();

  }

  bottom_bar.style.pointerEvents = 'none';
  app_container.classList.add('not-in-use');

});

close_chat_history_button.addEventListener('click', (e) => {
  e.preventDefault();

  user_chat_history_container.style.opacity = '0';
  user_chat_history_container.style.transform = 'translateX(-100%)';
  bottom_bar.style.pointerEvents = 'auto';
  app_container.classList.remove('not-in-use');

});

account_logout_button.addEventListener('click', (e) => {
  e.preventDefault();

  profile_info_logout_container.style.opacity = '1';
  profile_info_logout_container.style.transform = 'translateX(0%)';

  if (window.getComputedStyle(user_chat_history_container).display !== 'none') {
    close_chat_history_button.click();

  }

  bottom_bar.style.pointerEvents = 'none';
  app_container.classList.add('not-in-use');

});

close_profile_logout_button.addEventListener('click', (e) => {
  e.preventDefault();

  profile_info_logout_container.style.opacity = '0';
  profile_info_logout_container.style.transform = 'translateX(100%)';
  bottom_bar.style.pointerEvents = 'auto';
  app_container.classList.remove('not-in-use');

});

const scroll_to_bottom = () => {
  message_area.scrollTo({
    top: message_area.scrollHeight,
    behavior: 'instant'

  });

};

user_input.addEventListener('input', () => {
  user_input.style.height = 'auto';
  user_input.style.height = user_input.scrollHeight + 'px';

});

function calc_message_area_max_height() {
  requestAnimationFrame(() => {
    let bottom_bar_bottom = window.innerHeight - (visualViewport?.height || window.innerHeight);
    
    if (bottom_bar.offsetHeight === 0) {
      bottom_bar.getBoundingClientRect();
    }
    
    message_area.style.maxHeight = `calc(100% - ${bottom_bar.offsetHeight + bottom_bar_bottom + 70}px)`;
    
    requestAnimationFrame(() => {
      scroll_to_bottom();
    });

  });

}

calc_message_area_max_height();

new ResizeObserver(calc_message_area_max_height).observe(bottom_bar);

function is_scrollable(el) {
  return el.scrollHeight > el.clientHeight;

}

user_input.addEventListener('touchmove', (e) => {
  if (!is_scrollable(user_input)) {
    e.preventDefault();
  }

}, { passive: false });

fake_user_input.addEventListener('touchmove', (e) => {
  e.preventDefault();

}, { passive: false });

user_input.addEventListener('focus', () => {
  setTimeout(() => {
    fake_user_input.scrollTop = fake_user_input.scrollHeight;
    user_input.scrollTop = user_input.scrollHeight;

  }, 0);

  fake_user_input.style.opacity = 1;
  user_input.style.opacity = 0;

  visualViewport.addEventListener('resize', () => {
    const height_diff = window.innerHeight - visualViewport.height;

    if (height_diff > 150) {
      bottom_bar.style.bottom = `${height_diff}px`;
      bottom_bar.style.paddingBottom = `10px`;
      calc_message_area_max_height();

    }

  });

  setTimeout(() => {
    user_input.style.opacity = 1;
    fake_user_input.style.opacity = 0;

  }, 1000);

});

user_input.addEventListener('blur', () => {
  bottom_bar.style.bottom = '0px';
  bottom_bar.style.paddingBottom = `calc(env(safe-area-inset-bottom) + 10px)`;

  visualViewport.addEventListener('resize', () => {
    calc_message_area_max_height();

  })

  fake_user_input.textContent = user_input.value;

  if (user_input.value === '') {
    fake_user_input.textContent = 'Ask ToneFlex';

  }

});


user_input.addEventListener('touchend', () => {
  if (document.activeElement !== user_input) {
    user_input.focus();

  }

});

new_chat_button.addEventListener('click', (e) => {
  e.preventDefault();

  user_chat_history_container.style.opacity = '0';
  user_chat_history_container.style.transform = 'translateX(-100%)';
  bottom_bar.style.pointerEvents = 'auto';
  app_container.classList.remove('not-in-use');
  abort_controller?.abort();


  clearInterval(typing_interval);
  document.body.classList.remove('ai-responding');
  setTimeout(() => {
    is_first_prompt = true;
    content_log = [];
    user_data = {
      message: ''

    };
    user_input.value = '';
    message_area.innerHTML = '';
    fake_user_input.textContent = 'Ask ToneFlex';

  }, 30);

});

const typing_effect = (ai_response, ai_text, ai_message, ai_is_done) => {
  ai_text.textContent = '';
  let index = 0;
  let letters_per_step = 3;

  typing_interval = setInterval(() => {
    if (index < ai_response.length) {
      ai_text.textContent += ai_response.slice(index, index + letters_per_step);
      index += letters_per_step;
      scroll_to_bottom();
    } else {
      clearInterval(typing_interval);
      
      ai_text.innerHTML = formatTextWithBold(ai_response);
      
      document.body.classList.remove('ai-responding');
      if (ai_is_done) {
        ai_is_done();
      }
    }
  }, 100);
};

const create_message = (type) => {
  let div = document.createElement('div');
  div.classList.add(`${type}-message`);
  let p = document.createElement('p');
  p.classList.add(`${type}-text`);
  div.appendChild(p);
  /*--Changed by Jonathan */
  // Copy button should ONLY be added to AI messages
  if (type === "ai") {
    let copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = "Copy";
    // copy functionality
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(p.textContent)
        .then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = "Copy", 1500);
        })
        .catch(err => {
          console.error("Failed to copy:", err);
        });
    });
    div.appendChild(copyBtn);
  }
  return div;
};



const htmlToMarkdown = (html) => {
  if (!html) return '';
  return html.replace(/<span class="bold-text">(.*?)<\/span>/g, '**$1**');
};

const formatTextWithBold = (text) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  
  return text.replace(boldRegex, (match, textToBold) => {
    return `<span class="bold-text">${textToBold}</span>`;
  });
};

const generate_ai_response = async (ai_message, ai_is_done) => {
  let ai_text = ai_message.querySelector('.ai-text');
  abort_controller = new AbortController();
  
  if (await get_rpd_count() < 200) {
    await increment_rpd_counter();

  } else if (await get_rpd_count() === 200) {
    // await send_notification(await get_rpd_count());
    await increment_rpd_counter();

  } else {
    await increment_rpd_counter();

  }

  content_log.push({
    role: 'user',
    parts: [{
      text: user_data.message

    }]

  });

  try {
    const ai_response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: knowledge_base, contents: content_log, generationConfig: {maxOutputTokens: '200'} }),
      signal: abort_controller.signal

    });

    const ai_data = await ai_response.json();

    if (!ai_response.ok) {
      throw new Error(ai_data.error.message);

    }

    let ai_response_text = ai_data.candidates[0].content.parts[0].text.trim();

    typing_effect(ai_response_text, ai_text, ai_message, () => {
      if (ai_is_done) {
        ai_is_done();

      }

    });

    content_log.push({
      role: 'model',
      parts: [{ text: ai_response_text }]

    });

  } catch (error) {
    ai_text.textContent = error.name === 'AbortError' ? 'Response was interrupted.' : error.message;
    document.body.classList.remove('ai-responding');
    scroll_to_bottom();

  }



}

setPersistence(auth, browserLocalPersistence).then(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (window.getComputedStyle(app_container).display === 'none') {
        bottom_bar.style.pointerEvents = 'auto';
        app_container.classList.remove('not-in-use');
        bottom_bar.style.bottom = '0px';
        app_container.style.display = 'block';
        login_signup_container.style.display = 'none';

      }

      const user_ref = doc(db, 'users', user.uid);

      let u_data;
      while (true) {
        const docSnapshot = await getDoc(user_ref);
        
        if (docSnapshot.exists()) {
          u_data = docSnapshot.data();
          
          if (u_data.uid === user.uid) {
            console.log('✅ UID match confirmed, proceeding...');
            break;
          } else {
            console.log('⏳ Waiting for UID match...', {
              authUID: user.uid,
              docUID: u_data.uid
            });
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      

          if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              return;
            }
          }

          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "728d0c39-4560-40b9-8d93-be2f8e1b642a",
              autoPrompt: false,
              notifyButton: { enable: false },
              promptOptions: {
                slidedown: { enabled: false },
                welcomeNotification: { enabled: false },
              }
            });

            const notificationToggle = document.querySelector("#notificationToggle"); //Toggle

            if (Notification.permission === "denied"){
              notificationToggle.disabled = true;
              console.warn("Notifications are blocked in settings.");
            }

            notificationToggle.checked = OneSignal.User.PushSubscription.optedIn;
            notificationToggle.addEventListener("change", async (event) => {
              if (event.target.checked) {
                try{
                  const permission = await OneSignal.Notifications.requestPermission();
                  if (permission === "granted"){
                    await OneSignal.User.PushSubscription.optIn();
                    console.log("Notifications enabled");
                  } else {
                    console.warn("Permission not granted");
                    notificationToggle.checked = false;
                  }
                }catch (err) {
                  console.error("Failed enabling Notifications", err);
                  notificationToggle.checked = false;
                }
              }else {
                try{
                  await OneSignal.User.PushSubscription.optOut();
                  console.log("Notifications disabled");
                              } catch (err){
                  console.error("Failed disabling Notifications", err);
                }
              }
            });
            
            async function handleValidSubscription(subscriptionId) {
              if (u_data.sent_welcome) {
                console.log("⏭️ Welcome notification already sent, skipping.");
                return;
              }

              if (!subscriptionId) {
                console.error("❌ handleValidSubscription called without an ID.");
                return;
              }

              console.log("📤 Sending welcome notification to:", subscriptionId);
              try {
                await send_user_notification(subscriptionId);
                await updateDoc(user_ref, { sent_welcome: true });
                u_data.sent_welcome = true;
                console.log("✅ Welcome notification sent successfully.");
              } catch (error) {
                console.error("❌ Failed to send welcome notification:", error);
              }
            }

            console.log("👂 Setting up subscription change listener...");
            OneSignal.User.PushSubscription.addEventListener('change', (event) => {
              console.log("🔄 Subscription change event fired!");
              console.log("📋 Event details:", { current: event.current });

              if (event.current && event.current.id && event.current.optedIn && Notification.permission === "granted") {
                console.log("✨ Valid subscription detected via event listener.");
                handleValidSubscription(event.current.id);
              } else {
                console.log("❌ Not fully subscribed yet:", event.current);
              }
            });


            const isOptedIn = OneSignal.User.PushSubscription.optedIn;
            const existingId = OneSignal.User.PushSubscription.id;

            if (isOptedIn && existingId && Notification.permission === "granted") {
              console.log("🎯 User is already fully subscribed on page load.");
              handleValidSubscription(existingId);
            } else if (Notification.permission === "granted" && !isOptedIn) {
              console.log("🔑 Permission granted, attempting opt-in...");
              try {
                await OneSignal.User.PushSubscription.optIn();

                console.log("✅ Opt-in request sent.");
              } catch (error) {
                console.error("❌ Failed to opt-in after permission granted:", error);
              }
            } else {
              console.log("⚠️ User has not granted notifications:", Notification.permission);
            }

          });


          user_input.focus();
          setTimeout(() => user_input.blur(), 50);

          let today_time = get_pacific_time();
          let rpd_counter_ref = doc(db, 'rpd_counter', 'counter');
          let rpd_counter_ref_snapshot = await getDoc(rpd_counter_ref);
          let data_rpd = rpd_counter_ref_snapshot.data();
          let last_reset_date = data_rpd.last_reset_date;


          profile_logout_username_text.textContent = u_data.username;
          modified_user_chat_history = structuredClone(u_data.user_prompt_history);

          let chat_history_string = modified_user_chat_history.map(conversation => {
            let prompt_chat_text = '';

            if (conversation.user[0].trim() && conversation.user[0].trim() !== '') {
              prompt_chat_text = conversation.user[0].trim();

            } else if (conversation.ai[0].trim()) {
              prompt_chat_text = conversation.ai[0].trim();

            }

            return `
              <div class="chat-history-prompt">
                <p class="chat-history-prompt-text">
                  ${prompt_chat_text}
                </p>

              </div>
            `;

          }).join('');
          chat_history_prompts_container.innerHTML += chat_history_string;

          knowledge_base.parts[0].text = '';
          let all_text = modified_user_chat_history.flatMap(prompts => prompts.user).join(' / ');
          console.log(all_text);
          knowledge_base.parts[0].text = all_text;

          if (chat_history_prompts_container.innerHTML !== '') {
            chat_history_prompts_container.firstElementChild?.classList.add('prompt-selected');

            is_first_prompt = false;
            content_log = [];
            user_data = {
              message: ''

            };

            message_area.innerHTML = '';
            let conversation_string = '';

            console.log('modified_user_chat_history:', modified_user_chat_history);

            for (let i = 0; i < Math.max(modified_user_chat_history[0]?.user?.length || 0, modified_user_chat_history[0]?.ai?.length || 0); i++) {
              if (modified_user_chat_history[0]?.user[i] && modified_user_chat_history[0]?.user[i] !== '') {
                conversation_string += `<div class="user-message"><p class="user-text">${modified_user_chat_history[0].user[i]}</p></div>`;
              }
              if (modified_user_chat_history[0]?.ai[i]) {
                
                const formattedAiText = formatTextWithBold(modified_user_chat_history[0].ai[i]);
                conversation_string += `<div class="ai-message"><p class="ai-text">${formattedAiText}</p></div>`;
              }
            }

            message_area.innerHTML = conversation_string;

            setTimeout(() => {
              scroll_to_bottom();

            }, 200);

          }

          console.log(chat_history_prompts_container.firstElementChild);

      open_question_button_container.style.display = 'none';
      await start_daily_check();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop_daily_check();
        else start_daily_check();
      });

    } else {
      stop_daily_check();
      profile_logout_username_text.textContent = '';

    }

  });

}).catch((error) => {

});

function wait_for_ai_idle() {
  return new Promise((resolve) => {
    if (!document.body.classList.contains('ai-responding')) {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (!document.body.classList.contains('ai-responding')) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });

}

const handle_input = async (system_message = false, follow_up = null) => {
  const user_text = follow_up || user_input.value.trim();

  console.log(user_text);

  if (!user_text || document.body.classList.contains('ai-responding')) {
    return;

  }

  console.log(user_text);

  if (!system_message) user_input.value = '';

  user_data.message = user_text;
  document.body.classList.add('ai-responding');

  if (!system_message) {
    const user_message = create_message('user');
    user_message.querySelector('.user-text').textContent = user_text;
    message_area.appendChild(user_message);
    scroll_to_bottom();

  }

  let create_ai_message = async () => {
    const ai_message = create_message('ai');
    ai_message.querySelector('.ai-text').textContent = 'Loading...';
    message_area.appendChild(ai_message);
    scroll_to_bottom();
    generate_ai_response(ai_message, async () => {
      if (is_first_prompt) {
        let conversation = { user: [], ai: [] };

        Array.from(message_area.children).forEach(prompt => {
          if (prompt.classList.contains('user-message')) {
            conversation.user.push(prompt.querySelector('.user-text')?.textContent || '');
          } else if (prompt.classList.contains('ai-message')) {
            const aiTextElement = prompt.querySelector('.ai-text');
            let textToStore = aiTextElement.textContent;
            
            if (aiTextElement.innerHTML.includes('bold-text')) {
              textToStore = htmlToMarkdown(aiTextElement.innerHTML);
            }
            
            conversation.ai.push(textToStore);
            if (conversation.user.length === 0) {
              conversation.user.push('');
            }
          }
        });

        modified_user_chat_history.unshift(conversation);
        let chat_history_prompts = document.querySelectorAll('.chat-history-prompt');
        chat_history_prompts.forEach(chat_history_prompt => {
          chat_history_prompt.classList.remove('prompt-selected');

        });
        if (modified_user_chat_history[0].user[0] && modified_user_chat_history[0].user[0] !== '') {
          chat_history_prompts_container.insertAdjacentHTML('afterbegin', `
            <div class="chat-history-prompt prompt-selected">
              <p class="chat-history-prompt-text">
                ${modified_user_chat_history[0].user[0]}
              </p>

            </div>
          `);

        } else if (modified_user_chat_history[0].ai[0]) {
          chat_history_prompts_container.insertAdjacentHTML('afterbegin', `
            <div class="chat-history-prompt prompt-selected">
              <p class="chat-history-prompt-text">
                ${modified_user_chat_history[0].ai[0]}
              </p>

            </div>
          `);

        }
        is_first_prompt = false;

      } else {
         for (let i = 0; i < modified_user_chat_history.length; i++) {
          let conversation = modified_user_chat_history[i];

          console.log(conversation.user[0].trim() === document.querySelector('.chat-history-prompt.prompt-selected').textContent.trim());

          if (conversation.user[0].trim() === document.querySelector('.chat-history-prompt.prompt-selected').textContent.trim() || conversation.ai[0].trim() === document.querySelector('.chat-history-prompt.prompt-selected').textContent.trim()) {
            console.log('hi');
            conversation.user = [];
            conversation.ai = [];

            Array.from(message_area.children).forEach(prompt => {
              if (prompt.classList.contains('user-message')) {
                conversation.user.push(prompt.querySelector('.user-text')?.textContent || '');
              } else if (prompt.classList.contains('ai-message')) {
                const aiTextElement = prompt.querySelector('.ai-text');
                let textToStore = aiTextElement.textContent;
                
                if (aiTextElement.innerHTML.includes('bold-text')) {
                  textToStore = htmlToMarkdown(aiTextElement.innerHTML);
                }
                
                conversation.ai.push(textToStore);
                if (conversation.user.length === 0) {
                  conversation.user.push('');
                }
              }
            });

            let selected_text = '';

            if (conversation.user[0].trim() && conversation.user[0].trim() !== '') {
              selected_text = conversation.user[0].trim();

            } else if (conversation.ai[0].trim()) {
              selected_text = conversation.ai[0].trim();

            }

            modified_user_chat_history.splice(i, 1);
            modified_user_chat_history.unshift(conversation);

            chat_history_prompts_container.innerHTML = modified_user_chat_history.map((conversation, index) => {
              let is_selected_text = '';

              if (conversation.user[0].trim() && conversation.user[0].trim() !== '') {
                is_selected_text = conversation.user[0].trim();

              } else if (conversation.ai[0].trim()) {
                is_selected_text = conversation.ai[0].trim();

              }

              const is_selected = is_selected_text === selected_text;

              let conversation_prompt_text = '';

              if (conversation.user[0].trim() && conversation.user[0].trim() !== '') {
                conversation_prompt_text = conversation.user[0].trim();

              } else if (conversation.ai[0].trim()) {
                conversation_prompt_text = conversation.ai[0].trim();

              }
              
              return `<div class="chat-history-prompt ${is_selected ? 'prompt-selected' : ''}"><p class="chat-history-prompt-text">${conversation_prompt_text}</p></div>`

            }).join('');

            break;

          }

        }
        

      }

      knowledge_base.parts[0].text = '';
      let all_text = modified_user_chat_history.flatMap(prompts => prompts.user).join(' ');
      knowledge_base.parts[0].text = all_text;

      const current_user = auth.currentUser;

      console.log(current_user);

      if (current_user) {
        const user_ref = doc(db, 'users', current_user.uid);

        console.log(modified_user_chat_history);

        await updateDoc(user_ref, {
          user_prompt_history: modified_user_chat_history

        });

      }

    });

  };

  if (system_message) {
    await create_ai_message();

  } else {
    setTimeout(() => {
      create_ai_message();

    }, 600);

  }

}

input_button.addEventListener('click', async (e) => {
  e.preventDefault();
  await handle_input();
  user_input.style.height = '30px';

});

open_question_button.addEventListener('click', (e) => {
  e.preventDefault();

  window.open('https://toneflex.netlify.app/', '_blank');

});

input_button.addEventListener('mousedown', (e) => {
  e.preventDefault();

});

stop_button.addEventListener('click', (e) => {
  e.preventDefault();

  abort_controller?.abort();
  clearInterval(typing_interval);
  document.body.classList.remove('ai-responding');

});

stop_button.addEventListener('mousedown', (e) => {
  e.preventDefault();

});

logout_button.addEventListener('click', async (e) => {
  e.preventDefault();

  is_first_prompt = true;
  content_log = [];
  user_data = {
    message: ''

  };
  user_input.value = '';
  message_area.innerHTML = '';
  fake_user_input.textContent = 'Ask ToneFlex';
  chat_history_prompts_container.innerHTML = '';

  const user = auth.currentUser;

  if (user) {
    const user_ref = doc(db, 'users', user.uid);

    bottom_bar.style.pointerEvents = 'auto';
    app_container.classList.remove('not-in-use');
    bottom_bar.style.bottom = '0px';
    user_chat_history_container.style.opacity = '0';
    user_chat_history_container.style.transform = 'translateX(-100%)';
    profile_info_logout_container.style.opacity = '0';
    profile_info_logout_container.style.transform = 'translateX(100%)';
    login_signup_container.style.display = 'flex';
    app_container.style.display = 'none';

    await updateDoc(user_ref, {
      user_prompt_history: modified_user_chat_history

    }).then(() => {
      signOut(auth).then(() => {

      }).catch((error) => {
        console.error('error logging out: error');

      });
    });

    modified_user_chat_history = [];
    knowledge_base.parts[0].text = '';

  }

});

// Color change button logic -Nathan
  let selectedColor = 0;
  color_selector_button.addEventListener('click', async (e) => {

    //console.log("Color selector clicked");

    const colorArray = [['#584cd7', '#756aec', '#594acc'] , ['#0B6623', '#638438', '#0C6418'], ['#CA3433', '#FF5248', '#CB3228'], ['#737000', '#CC8E15', '#746E00']];
    // Main bg color, ai-message color, seecondary color
    let change = true;
    //console.log(colorArray[0][0]);
    
    // const getValue = (elem, property) => 
    // window.getComputedStyle(elem, null)
    //     .getPropertyValue(property);

    //const user_message_color = document.querySelector('.user-message');

    //document.querySelectorAll('*').forEach((elem) => {
      // const backgroundColor = getValue(elem, 'background-color');
      // const color = getValue(elem, 'color');

      if(change)
      {
        if (selectedColor >= colorArray.length - 1) { 
          selectedColor = 0;
        }   
        else {
        selectedColor += 1; 
        }

        console.log(selectedColor);
        change = false;
      }
      
      document.documentElement.style.setProperty('--bg-color', colorArray[selectedColor][0]);
      document.documentElement.style.setProperty('--ai-text-color', colorArray[selectedColor][1]);
      document.documentElement.style.setProperty('--secondary-color', colorArray[selectedColor][2]);

 
    change = true;
  })


export { bottom_bar };

