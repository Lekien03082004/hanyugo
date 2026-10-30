// LinguaMaster & HanyuGo Pro Engine
// Copyright (c) 2026

// ==================== STATE ====================
let currentLang = 'zh'; // 'zh' | 'en'
let currentTab = 'writing'; // 'writing' | 'home' | 'vocab' | 'settings'
let allWords = []; // All words for currentLang
let filteredWords = []; // Words matching active deck filter
let currentDeck = 'all'; // 'all' or deck name
let currentCharIndex = 0;
let currentDrillIndex = 0;
let writingMode = 'model';
let speechRate = 1.0;

// Audio player element
const audioEl = document.getElementById('audioPlayer') || new Audio();

// ==================== RICH HANZI KNOWLEDGE BASE ====================
const DEFAULT_HANZI_DB = {
  "爱": {
    pinyin: "ài",
    tone: "Thanh 4 (`)",
    meaning: "Yêu, thương, thích thú",
    hanViet: "ÁI",
    radical: "爪 / 爫 - Bộ Trảo (Móng vuốt)",
    strokeCount: "10 nét",
    strokeRule: "Trên ➔ Dưới (Ngoài vào trong)",
    story: "Quy tắc: Viết phẩy trước (爫), rồi đến trùm (冖), tiếp theo tâm (心) và hữu (友). Dùng móng vuốt chở che cho trái tim người bạn/người yêu.",
    strokes: ["1. Phẩy", "2. Chấm", "3. Chấm", "4. Phẩy", "5. Chấm", "6. Phẩy", "7. Móc", "8. Phẩy", "9. Phẩy", "10. Mác"],
    collocZh: "我 <span class='text-red-700 underline underline-offset-4 decoration-2'>爱</span> 学习汉语",
    collocPinyin: "Wǒ ài xuéxí Hànyǔ",
    collocVi: "Tôi yêu việc học tiếng Trung."
  },
  "学": {
    pinyin: "xué",
    tone: "Thanh 2 (´)",
    meaning: "Học tập, học hỏi",
    hanViet: "HỌC",
    radical: "子 - Bộ Tử (Đứa trẻ)",
    strokeCount: "8 nét",
    strokeRule: "Trên ➔ Dưới (Trái qua phải)",
    story: "Đứa trẻ (子) ở dưới mái nhà (冖) nỗ lực tiếp thu tri thức tỏa sáng (3 dấu chấm phẩy phía trên).",
    strokes: ["1. Chấm", "2. Chấm", "3. Phẩy", "4. Chấm", "5. Móc", "6. Ngang phẩy", "7. Cong móc", "8. Ngang"],
    collocZh: "努力 <span class='text-red-700 underline underline-offset-4 decoration-2'>学</span> 习",
    collocPinyin: "Nǔ lì xué xí",
    collocVi: "Nỗ lực, cố gắng học tập."
  },
  "好": {
    pinyin: "hǎo",
    tone: "Thanh 3 (ˇ)",
    meaning: "Tốt, đẹp, hay, thân thiện",
    hanViet: "HẢO",
    radical: "女 - Bộ Nữ (Phụ nữ)",
    strokeCount: "6 nét",
    strokeRule: "Trái ➔ Phải",
    story: "Người phụ nữ (女) bên cạnh đứa con trai (子) là điều tốt lành, trọn vẹn và hạnh phúc nhất.",
    strokes: ["1. Gập", "2. Phẩy", "3. Hất", "4. Ngang phẩy", "5. Cong móc", "6. Ngang"],
    collocZh: "你 <span class='text-red-700 underline underline-offset-4 decoration-2'>好</span>，朋友！",
    collocPinyin: "Nǐ hǎo, péng you!",
    collocVi: "Xin chào bạn tốt!"
  },
  "友": {
    pinyin: "yǒu",
    tone: "Thanh 3 (ˇ)",
    meaning: "Bạn bè, bằng hữu, thân thiện",
    hanViet: "HỮU",
    radical: "又 - Bộ Hựu (Bàn tay phải)",
    strokeCount: "4 nét",
    strokeRule: "Trên ➔ Dưới",
    story: "Hai bàn tay đan vào nhau cùng chung một hướng biểu thị tình bạn gắn kết keo sơn.",
    strokes: ["1. Ngang", "2. Phẩy", "3. Ngang gập", "4. Mác"],
    collocZh: "好 <span class='text-red-700 underline underline-offset-4 decoration-2'>友</span> 一生",
    collocPinyin: "Hǎo yǒu yì shēng",
    collocVi: "Bạn tốt trọn một đời."
  },
  "谢": {
    pinyin: "xiè",
    tone: "Thanh 4 (`)",
    meaning: "Cảm ơn, tạ ơn, tàn (hoa)",
    hanViet: "TẠ",
    radical: "讠 - Bộ Ngôn (Lời nói)",
    strokeCount: "12 nét",
    strokeRule: "Trái ➔ Giữa ➔ Phải",
    story: "Dùng lời nói (讠) từ tận thân thể tấm lòng (身) để bắn đi (寸) sự biết ơn chân thành nhất.",
    strokes: ["1. Chấm", "2. Gập", "3. Phẩy", "4. Ngang gập", "5. Ngang", "6. Ngang", "7. Ngang", "8. Sổ", "9. Phẩy", "10. Ngang", "11. Móc", "12. Chấm"],
    collocZh: "非常感 <span class='text-red-700 underline underline-offset-4 decoration-2'>谢</span>",
    collocPinyin: "Fēi cháng gǎn xiè",
    collocVi: "Vô cùng cảm tạ / cảm ơn."
  },
  "明": {
    pinyin: "míng",
    tone: "Thanh 2 (´)",
    meaning: "Sáng sủa, rõ ràng, hiểu rõ",
    hanViet: "MINH",
    radical: "日 - Bộ Nhật (Mặt trời)",
    strokeCount: "8 nét",
    strokeRule: "Trái ➔ Phải",
    story: "Mặt trời (日) kết hợp với mặt trăng (月) tạo nên nguồn ánh sáng rực rỡ và quang minh nhất vũ trụ.",
    strokes: ["1. Sổ", "2. Ngang gập", "3. Ngang", "4. Ngang", "5. Phẩy", "6. Ngang gập", "7. Ngang", "8. Ngang"],
    collocZh: "<span class='text-red-700 underline underline-offset-4 decoration-2'>明</span> 白了吗？",
    collocPinyin: "Míng bai le ma?",
    collocVi: "Đã hiểu rõ chưa?"
  }
};

// User-edited Hanzi details stored in localStorage
function getCustomHanziDB() {
  try {
    const raw = localStorage.getItem('hanyugo_custom_hanzi_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveCustomHanziDB(data) {
  try {
    localStorage.setItem('hanyugo_custom_hanzi_v1', JSON.stringify(data));
  } catch (e) {}
}

function getCharacterDetails(char, fallbackItem = {}) {
  const customDB = getCustomHanziDB();
  if (customDB[char]) {
    return customDB[char];
  }
  if (DEFAULT_HANZI_DB[char]) {
    return { ...DEFAULT_HANZI_DB[char] };
  }

  // Auto generated fallback
  return {
    pinyin: fallbackItem.phonetic || "--",
    tone: "Thanh chuẩn",
    meaning: fallbackItem.meaning || "--",
    hanViet: deriveHanViet(char),
    radical: "Chữ Hán chuẩn",
    radicalName: "Bộ cấu thành",
    strokeCount: `${estimateStrokes(char)} nét`,
    strokeRule: "Trên ➔ Dưới (Trái qua phải)",
    story: "Quy tắc viết: Tương hỗ giữa các nét chuẩn mực, viết theo thứ tự trên trước dưới sau, ngoài trước trong sau.",
    strokes: ["1. Nét đầu", "2. Nét thứ hai", "3. Nét thứ ba", "4. Nét hoàn thiện"],
    collocZh: `${char} (Ví dụ thực tế)`,
    collocPinyin: fallbackItem.phonetic || "",
    collocVi: fallbackItem.example || fallbackItem.meaning || "Câu ví dụ minh họa."
  };
}

// Default Starter Words
const STARTER_ZH = [
  { word: "爱", phonetic: "ài", meaning: "Yêu, thương, thích thú", example: "我爱学习汉语", deck: "HSK 1" },
  { word: "学", phonetic: "xué", meaning: "Học tập, học hỏi", example: "我们要努力学习", deck: "HSK 1" },
  { word: "好", phonetic: "hǎo", meaning: "Tốt, đẹp, thân thiện", example: "今天天气真好", deck: "Giao tiếp hàng ngày" },
  { word: "友", phonetic: "yǒu", meaning: "Bạn bè, bằng hữu", example: "海内存知己", deck: "Giao tiếp hàng ngày" },
  { word: "谢", phonetic: "xiè", meaning: "Cảm ơn, tạ ơn", example: "谢谢你的热情帮助", deck: "Giao tiếp hàng ngày" },
  { word: "明", phonetic: "míng", meaning: "Sáng sủa, hiểu rõ", example: "我已经完全明白了", deck: "HSK 1" }
];

const STARTER_EN = [
  { word: "appreciate", phonetic: "/əˈpriːʃieɪt/", meaning: "cảm kích, trân trọng", example: "I really appreciate your kind help.", deck: "Giao tiếp căn bản" },
  { word: "resilient", phonetic: "/rɪˈzɪliənt/", meaning: "kiên cường, phục hồi nhanh", example: "She is remarkably resilient in difficult situations.", deck: "Từ vựng nâng cao" },
  { word: "confidence", phonetic: "/ˈkɒnfɪdəns/", meaning: "sự tự tin, lòng tin", example: "Practice will boost your speaking confidence.", deck: "Giao tiếp căn bản" },
  { word: "enthusiastic", phonetic: "/ɪnˌθjuːziˈæstɪk/", meaning: "nhiệt huyết, hào hứng", example: "He is very enthusiastic about learning new skills.", deck: "Từ vựng nâng cao" }
];

// ==================== STORAGE FOR DECKS & WORDS ====================
function getWordsKey(lang) {
  return `hanyugo_v3_words_${lang}`;
}

function getDecksKey(lang) {
  return `hanyugo_v3_decks_${lang}`;
}

function loadDecksFromStorage(lang) {
  try {
    const raw = localStorage.getItem(getDecksKey(lang));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return lang === 'zh' ? ["HSK 1", "Giao tiếp hàng ngày", "Đi du lịch"] : ["Giao tiếp căn bản", "Từ vựng nâng cao", "Collocations"];
}

function saveDecksToStorage(lang, decks) {
  try {
    localStorage.setItem(getDecksKey(lang), JSON.stringify(decks));
  } catch (e) {}
}

function loadWordsFromStorage(lang) {
  try {
    const raw = localStorage.getItem(getWordsKey(lang));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveWordsToStorage(lang, list) {
  try {
    localStorage.setItem(getWordsKey(lang), JSON.stringify(list));
  } catch (e) {}
}

function initData() {
  let zh = loadWordsFromStorage('zh');
  if (!zh || zh.length === 0) {
    zh = STARTER_ZH.map((w, i) => ({
      id: 'zh_' + Date.now() + '_' + i,
      lang: 'zh',
      word: w.word,
      phonetic: w.phonetic,
      meaning: w.meaning,
      example: w.example,
      deck: w.deck || "HSK 1",
      favorite: false
    }));
    saveWordsToStorage('zh', zh);
  }

  let en = loadWordsFromStorage('en');
  if (!en || en.length === 0) {
    en = STARTER_EN.map((w, i) => ({
      id: 'en_' + Date.now() + '_' + i,
      lang: 'en',
      word: w.word,
      phonetic: w.phonetic,
      meaning: w.meaning,
      example: w.example,
      deck: w.deck || "Giao tiếp căn bản",
      favorite: false
    }));
    saveWordsToStorage('en', en);
  }

  loadLanguage(currentLang);
  initCanvas();
}

function loadLanguage(lang) {
  currentLang = lang;
  allWords = loadWordsFromStorage(lang) || [];
  currentDeck = 'all';

  const btnZh = document.getElementById('btnLangZh');
  const btnEn = document.getElementById('btnLangEn');
  if (lang === 'zh') {
    btnZh.className = 'px-2.5 py-1 text-xs font-bold rounded-full bg-red-700 text-white shadow-sm transition';
    btnEn.className = 'px-2.5 py-1 text-xs font-semibold rounded-full text-slate-500 hover:text-slate-800 transition';
    document.getElementById('importLangLabel').textContent = 'Tiếng Trung';
    document.getElementById('tabHintDisplay').innerHTML = `Chữ Hán <span class="text-amber-600">[Tab]</span> Pinyin <span class="text-amber-600">[Tab]</span> Nghĩa <span class="text-amber-600">[Tab]</span> Ví dụ`;
    document.getElementById('modalField1Text').textContent = 'Chữ Hán (*):';
    document.getElementById('modalField2Text').textContent = 'Pinyin:';
    document.getElementById('homeChinesePreview').classList.remove('hidden');
    document.getElementById('homeInputHelper').textContent = 'Gõ Pinyin (hỗ trợ có dấu, có số hoặc viết liền) rồi nhấn Enter.';
    document.getElementById('drillModeTitle').textContent = 'Luyện gõ Pinyin phản xạ';
  } else {
    btnEn.className = 'px-2.5 py-1 text-xs font-bold rounded-full bg-red-700 text-white shadow-sm transition';
    btnZh.className = 'px-2.5 py-1 text-xs font-semibold rounded-full text-slate-500 hover:text-slate-800 transition';
    document.getElementById('importLangLabel').textContent = 'Tiếng Anh';
    document.getElementById('tabHintDisplay').innerHTML = `Từ <span class="text-amber-600">[Tab]</span> Phiên âm <span class="text-amber-600">[Tab]</span> Nghĩa <span class="text-amber-600">[Tab]</span> Ví dụ`;
    document.getElementById('modalField1Text').textContent = 'Từ tiếng Anh (*):';
    document.getElementById('modalField2Text').textContent = 'Phiên âm:';
    document.getElementById('homeChinesePreview').classList.add('hidden');
    document.getElementById('homeInputHelper').textContent = 'Gõ từ tiếng Anh rồi nhấn Enter.';
    document.getElementById('drillModeTitle').textContent = 'Luyện gõ từ vựng tiếng Anh';
  }

  updateDeckDropdowns();
  applyDeckFilter();
}

function switchLanguage(lang) {
  if (currentLang !== lang) {
    loadLanguage(lang);
    if (lang === 'en' && currentTab === 'writing') {
      switchTab('home');
    }
  }
}

// ==================== BỘ TỪ (DECK MANAGEMENT) ====================
function updateDeckDropdowns() {
  const decks = loadDecksFromStorage(currentLang);
  const selector = document.getElementById('deckSelector');
  const importTarget = document.getElementById('importTargetDeck');
  const modalDeck = document.getElementById('modalDeckSelect');

  selector.innerHTML = `
    <option value="all">📂 Tất cả từ vựng (${allWords.length})</option>
    ${decks.map(d => {
      const count = allWords.filter(w => (w.deck || 'Chưa phân loại') === d).length;
      return `<option value="${d}">${d} (${count} từ)</option>`;
    }).join('')}
  `;
  selector.value = currentDeck;

  importTarget.innerHTML = decks.map(d => `<option value="${d}">${d}</option>`).join('');
  modalDeck.innerHTML = decks.map(d => `<option value="${d}">${d}</option>`).join('');

  renderDeckManager();
}

function onSelectDeckChange() {
  currentDeck = document.getElementById('deckSelector').value;
  applyDeckFilter();
}

function applyDeckFilter() {
  if (currentDeck === 'all') {
    filteredWords = [...allWords];
    document.getElementById('headerDeckSubtitle').textContent = `Tất cả các bộ • ${filteredWords.length} từ`;
  } else {
    filteredWords = allWords.filter(w => (w.deck || 'Chưa phân loại') === currentDeck);
    document.getElementById('headerDeckSubtitle').textContent = `Bộ: ${currentDeck} • ${filteredWords.length} từ`;
  }

  // Hiện / ẩn nút xóa bộ ở thanh trên cùng
  const btnDel = document.getElementById('btnDeleteCurrentDeck');
  if (btnDel) {
    if (currentDeck === 'all') {
      btnDel.classList.add('hidden');
    } else {
      btnDel.classList.remove('hidden');
    }
  }

  currentCharIndex = 0;
  currentDrillIndex = 0;
  currentCardIndex = 0;
  currentPronounceIndex = 0;

  renderCurrentCharacter();
  renderHomeDrill();
  renderFlashcard();
  renderVocabList();
  renderPronounceWord();
}

function openCreateDeckModal() {
  document.getElementById('newDeckNameInput').value = '';
  document.getElementById('deckModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('newDeckNameInput').focus(), 150);
}

function closeCreateDeckModal() {
  document.getElementById('deckModal').classList.add('hidden');
}

function saveNewDeck() {
  const name = document.getElementById('newDeckNameInput').value.trim();
  if (!name) {
    alert('Vui lòng nhập tên bộ từ!');
    return;
  }

  const decks = loadDecksFromStorage(currentLang);
  if (!decks.includes(name)) {
    decks.push(name);
    saveDecksToStorage(currentLang, decks);
  }

  currentDeck = name;
  updateDeckDropdowns();
  applyDeckFilter();
  closeCreateDeckModal();
  alert(`Đã tạo bộ từ mới: "${name}"!`);
}

function confirmDeleteCurrentDeck() {
  if (currentDeck === 'all') return;
  deleteDeckByName(currentDeck);
}

function deleteDeckByName(deckName) {
  if (!deckName || deckName === 'all') return;

  const wordsInDeck = allWords.filter(w => (w.deck || 'Chưa phân loại') === deckName);
  const msg = `⚠️ XÁC NHẬN XÓA BỘ TỪ: "${deckName}"?\n\n- Bộ này hiện đang có ${wordsInDeck.length} từ vựng.\n- Khi xóa, toàn bộ ${wordsInDeck.length} từ này sẽ bị xóa khỏi kho từ vựng.\n\nBạn có chắc chắn muốn xóa không?`;

  if (confirm(msg)) {
    // Xóa toàn bộ từ thuộc bộ này
    allWords = allWords.filter(w => (w.deck || 'Chưa phân loại') !== deckName);
    saveWordsToStorage(currentLang, allWords);

    // Xóa tên bộ khỏi danh sách decks
    let decks = loadDecksFromStorage(currentLang);
    decks = decks.filter(d => d !== deckName);
    if (decks.length === 0) {
      decks = [currentLang === 'zh' ? 'HSK 1' : 'Cơ bản'];
    }
    saveDecksToStorage(currentLang, decks);

    currentDeck = 'all';
    updateDeckDropdowns();
    applyDeckFilter();
    alert(`Đã xóa thành công bộ từ "${deckName}" và ${wordsInDeck.length} từ liên quan!`);
  }
}

function clearAllWordsForCurrentLang() {
  const langTitle = currentLang === 'zh' ? 'Tiếng Trung' : 'Tiếng Anh';
  const count = allWords.length;
  if (count === 0) {
    alert(`Kho từ ${langTitle} hiện đang trống.`);
    return;
  }

  const msg = `🚨 CẢNH BÁO QUAN TRỌNG 🚨\n\nBạn có chắc chắn muốn xóa TẤT CẢ ${count} từ vựng ${langTitle} trong kho không?\n\n(Thao tác này sẽ làm sạch hoàn toàn để bạn nạp bộ từ mới từ file Tab hoặc tạo từ mới từ đầu).`;

  if (confirm(msg)) {
    allWords = [];
    saveWordsToStorage(currentLang, allWords);
    currentDeck = 'all';
    updateDeckDropdowns();
    applyDeckFilter();
    alert(`Đã xóa sạch toàn bộ từ vựng ${langTitle}! Bạn có thể nhập bộ từ mới.`);
  }
}

function renderDeckManager() {
  const container = document.getElementById('deckManagerList');
  if (!container) return;

  const decks = loadDecksFromStorage(currentLang);
  const badge = document.getElementById('decksCountBadge');
  if (badge) badge.textContent = `${decks.length} bộ từ`;

  if (decks.length === 0) {
    container.innerHTML = `<div class="p-3 text-center text-xs text-slate-400">Chưa có bộ từ vựng nào.</div>`;
    return;
  }

  container.innerHTML = decks.map(d => {
    const count = allWords.filter(w => (w.deck || 'Chưa phân loại') === d).length;
    const isSelected = currentDeck === d;
    return `
      <div class="flex items-center justify-between p-3 rounded-2xl border ${isSelected ? 'bg-rose-50/50 border-red-200' : 'bg-slate-50 border-slate-200'} transition">
        <div class="flex-1 min-w-0 pr-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold ${isSelected ? 'text-red-700' : 'text-slate-800'} truncate">📁 ${d}</span>
            ${isSelected ? '<span class="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">Đang chọn</span>' : ''}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5 font-medium">${count} từ vựng</div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button onclick="selectDeckFromManager('${escapeStr(d)}')" class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition">
            Xem
          </button>
          <button onclick="deleteDeckByName('${escapeStr(d)}')" class="p-1.5 text-slate-300 hover:text-red-600 hover:bg-rose-100 rounded-xl transition" title="Xóa cả bộ này">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectDeckFromManager(deckName) {
  currentDeck = deckName;
  updateDeckDropdowns();
  applyDeckFilter();
  switchTab('vocab');
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabId) {
  // Dừng mọi mic đang thu nếu rời tab
  if (currentTab === 'pronounce' && tabId !== 'pronounce') {
    if (typeof stopPronounceRecording === 'function') stopPronounceRecording();
    if (typeof stopHardRecording === 'function') stopHardRecording();
    if (typeof stopFreeRecording === 'function') stopFreeRecording();
  }

  currentTab = tabId;
  const tabs = ['writing', 'pronounce', 'home', 'flashcard', 'vocab', 'settings'];
  const navIds = {
    writing: 'navWriting',
    pronounce: 'navPronounce',
    home: 'navHome',
    flashcard: 'navFlashcard',
    vocab: 'navVocab',
    settings: 'navSettings'
  };

  tabs.forEach(t => {
    const sec = document.getElementById('tab' + capitalize(t));
    const btn = document.getElementById(navIds[t]);
    if (t === tabId) {
      if (sec) sec.classList.remove('hidden');
      if (btn) {
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-red-700', 'font-bold');
      }
    } else {
      if (sec) sec.classList.add('hidden');
      if (btn) {
        btn.classList.add('text-slate-400');
        btn.classList.remove('text-red-700', 'font-bold');
      }
    }
  });

  if (tabId === 'writing') {
    renderCurrentCharacter();
    clearCanvas();
  } else if (tabId === 'pronounce') {
    renderPronounceWord();
  } else if (tabId === 'home') {
    renderHomeDrill();
    setTimeout(() => {
      const inp = document.getElementById('homeDrillInput');
      if (inp) inp.focus();
    }, 150);
  } else if (tabId === 'flashcard') {
    renderFlashcard();
  } else if (tabId === 'vocab') {
    renderVocabList();
  } else if (tabId === 'settings') {
    renderDeckManager();
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ==================== FLASHCARD 3D ENGINE ====================
let currentCardIndex = 0;
let isCardFlipped = false;

function renderFlashcard() {
  const cardInner = document.getElementById('flashcardInner');
  if (cardInner) {
    cardInner.classList.remove('card-flipped');
  }
  isCardFlipped = false;

  if (filteredWords.length === 0) {
    document.getElementById('cardFrontText').textContent = 'Chưa có từ';
    document.getElementById('cardPhonetic').textContent = '--';
    document.getElementById('cardBackMeaning').textContent = 'Vui lòng chọn bộ từ khác hoặc nạp từ mới.';
    document.getElementById('cardBackExample').textContent = '';
    document.getElementById('cardProgress').textContent = '0/0';
    return;
  }

  if (currentCardIndex >= filteredWords.length) currentCardIndex = 0;
  if (currentCardIndex < 0) currentCardIndex = filteredWords.length - 1;

  const item = filteredWords[currentCardIndex];
  document.getElementById('cardProgress').textContent = `${currentCardIndex + 1}/${filteredWords.length}`;
  document.getElementById('cardFrontText').textContent = item.word;
  document.getElementById('cardPhonetic').textContent = item.phonetic || '';
  document.getElementById('cardBackMeaning').textContent = item.meaning;
  document.getElementById('cardBackExample').textContent = item.example || 'Không có câu ví dụ';

  if (currentLang === 'zh') {
    document.getElementById('cardFrontText').className = 'font-hanzi text-6xl sm:text-7xl font-bold text-red-700 tracking-wide my-2 leading-none';
    document.getElementById('cardBadge').textContent = `🇨🇳 Tiếng Trung • ${item.deck || 'Chung'}`;
  } else {
    document.getElementById('cardFrontText').className = 'text-4xl sm:text-5xl font-extrabold text-red-700 tracking-wide my-2 leading-tight';
    document.getElementById('cardBadge').textContent = `🇬🇧 Tiếng Anh • ${item.deck || 'Chung'}`;
  }

  const favBtn = document.getElementById('btnCardFav');
  if (favBtn) {
    favBtn.className = item.favorite
      ? 'p-3 bg-rose-50 text-red-600 rounded-2xl border border-rose-300 transition'
      : 'p-3 bg-slate-100 text-slate-400 rounded-2xl border border-slate-200 transition hover:text-red-600';
  }
}

function playFlashcardExampleAudio() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCardIndex];
  let text = item.example;
  if (!text || !text.trim()) {
    const details = getCharacterDetails(item.word, item);
    text = details.collocZh ? details.collocZh.replace(/<[^>]*>/g, '') : item.word;
  }
  playAudioVoice(text, currentLang, 1.0);
}

function flipFlashcard() {
  const cardInner = document.getElementById('flashcardInner');
  if (!cardInner) return;
  isCardFlipped = !isCardFlipped;
  if (isCardFlipped) {
    cardInner.classList.add('card-flipped');
    // Khi lật ra mặt sau, tự động phát âm câu ví dụ minh họa
    setTimeout(() => {
      if (isCardFlipped) {
        playFlashcardExampleAudio();
      }
    }, 280);
  } else {
    cardInner.classList.remove('card-flipped');
  }
}

function nextFlashcard() {
  if (filteredWords.length === 0) return;
  currentCardIndex = (currentCardIndex + 1) % filteredWords.length;
  renderFlashcard();
}

function prevFlashcard() {
  if (filteredWords.length === 0) return;
  currentCardIndex = (currentCardIndex - 1 + filteredWords.length) % filteredWords.length;
  renderFlashcard();
}

function toggleCardFavorite() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCardIndex];
  item.favorite = !item.favorite;
  saveWordsToStorage(currentLang, allWords);
  renderFlashcard();
  renderVocabList();
}

let lastAudioTapTimestamp = 0;
let currentActiveAudioInstance = null;
let currentPlaybackSpeed = 1.0;

function setAudioPlaybackSpeed(speed, btnElem) {
  currentPlaybackSpeed = speed;
  const label = document.getElementById('currentSpeedLabel');
  if (label) label.textContent = `${speed}x`;

  const container = document.getElementById('speedPillsContainer');
  if (container) {
    const pills = container.querySelectorAll('.speed-pill');
    pills.forEach(p => {
      p.className = 'speed-pill px-2.5 py-1 text-xs font-bold rounded-xl text-slate-600 hover:bg-white transition';
    });
    if (btnElem) {
      btnElem.className = 'speed-pill active px-3 py-1 text-xs font-bold rounded-xl bg-red-700 text-white shadow-2xs transition';
    }
  }

  // Phát âm ngay với tốc độ mới
  speakCurrentWord();
}

function playFlashcardAudio() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCardIndex];
  playAudioVoice(item.word, currentLang, 1.0);
}

// ==================== HỆ THỐNG ÂM THANH CHUẨN GIỌNG BẮC KINH (BEIJING ACCENT) & ANDROID CHROME FIX ====================
let availableSystemVoices = [];
let activeUtterance = null; // Biến toàn cục giữ tham chiếu để chống Android Chrome Garbage Collection tự động ngắt tiếng

function initSpeechVoices() {
  if ('speechSynthesis' in window) {
    try {
      availableSystemVoices = window.speechSynthesis.getVoices() || [];
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          availableSystemVoices = window.speechSynthesis.getVoices() || [];
        } catch (e) {}
      };
    } catch (e) {}
  }
}
initSpeechVoices();

// Bộ chọn giọng chuẩn Bắc Kinh (Mainland Beijing Putonghua)
function findBestBeijingVoice() {
  if (!availableSystemVoices || availableSystemVoices.length === 0) {
    if ('speechSynthesis' in window) {
      availableSystemVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  if (!availableSystemVoices || availableSystemVoices.length === 0) return null;

  // 1. Lọc tất cả các giọng tiếng Trung Đại Lục (loại trừ Đài Loan zh-TW và Hồng Kông zh-HK / Quảng Đông)
  const mainlandVoices = availableSystemVoices.filter(v => {
    const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
    const n = (v.name || '').toLowerCase();
    const isZh = l.startsWith('zh') || l.startsWith('cmn');
    const isNotSouthern = !l.includes('tw') && !l.includes('hk') && !n.includes('taiwan') && !n.includes('cantonese') && !n.includes('hong kong');
    return isZh && isNotSouthern;
  });

  if (mainlandVoices.length > 0) {
    // Ưu tiên giọng Bắc Kinh tiêu chuẩn Google hoặc giọng tự nhiên
    const best = mainlandVoices.find(v => {
      const n = (v.name || '').toLowerCase();
      return n.includes('google') || n.includes('beijing') || n.includes('普通话') || n.includes('ting-ting') || n.includes('natural');
    });
    return best || mainlandVoices[0];
  }

  // 2. Dự phòng: bất kỳ giọng zh nào
  return availableSystemVoices.find(v => (v.lang || '').toLowerCase().startsWith('zh')) || null;
}

function findBestEnglishVoice() {
  if (!availableSystemVoices || availableSystemVoices.length === 0) {
    if ('speechSynthesis' in window) {
      availableSystemVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  if (!availableSystemVoices || availableSystemVoices.length === 0) return null;
  return availableSystemVoices.find(v => (v.lang || '').toLowerCase().replace(/_/g, '-').startsWith('en-us')) ||
         availableSystemVoices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || null;
}

function speakWithNativeTTS(text, lang = currentLang, rate = 1.0) {
  if (!('speechSynthesis' in window)) return;

  const isZh = (lang === 'zh');
  const targetLang = isZh ? 'zh-CN' : 'en-US';

  // Sửa lỗi Android Chrome: nếu đang bị kẹt pause thì đánh thức lại
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Nếu đang nói thì dừng để nói câu mới (nhưng chỉ cancel khi speaking để tránh lỗi triệt tiêu âm trên Android)
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utt = new SpeechSynthesisUtterance(text);
  activeUtterance = utt; // Giữ tham chiếu sống

  utt.lang = targetLang;
  utt.rate = Math.max(0.7, Math.min(rate, 1.2));
  utt.pitch = 1.0;
  utt.volume = 1.0;

  // Gán giọng Bắc Kinh chuẩn
  const selectedVoice = isZh ? findBestBeijingVoice() : findBestEnglishVoice();
  if (selectedVoice) {
    utt.voice = selectedVoice;
  }

  utt.onend = () => {
    if (activeUtterance === utt) activeUtterance = null;
  };

  utt.onerror = (e) => {
    console.warn('[TTS Error]:', e);
    if (activeUtterance === utt) activeUtterance = null;
  };

  try {
    window.speechSynthesis.speak(utt);
  } catch (err) {
    console.warn('speak error:', err);
  }
}

// Kiểm tra xem có đang mở trực tiếp từ máy tính (mạng LAN / localhost) không
function isLocalPythonServerHost() {
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.')
  );
}

let isServerOnline = isLocalPythonServerHost();

function playAudioVoice(text, lang = currentLang, rate = 1.0) {
  if (!text) return;
  const clean = text.replace(/<[^>]*>/g, '').trim();
  if (!clean) return;

  // Chống bấm liên thanh
  const now = Date.now();
  if (now - lastAudioTapTimestamp < 250) return;
  lastAudioTapTimestamp = now;

  // Dừng âm thanh cũ nếu đang phát
  if (currentActiveAudioInstance) {
    try {
      currentActiveAudioInstance.pause();
      currentActiveAudioInstance.currentTime = 0;
    } catch (e) {}
    currentActiveAudioInstance = null;
  }

  const isZh = (lang === 'zh');

  // 1. NẾU ĐANG CHẠY TRÊN MÁY TÍNH CÓ PYTHON SERVER: Dùng endpoint /tts
  if (isLocalPythonServerHost() && isServerOnline) {
    const ttsUrl = `/tts?text=${encodeURIComponent(clean)}&lang=${isZh ? 'zh' : 'en'}`;
    const player = new Audio();
    currentActiveAudioInstance = player;
    player.playbackRate = rate;
    player.src = ttsUrl;
    player.onerror = () => {
      isServerOnline = false;
      playOnlineOrNativeVoice(clean, isZh, rate);
    };
    player.play().catch(() => {
      playOnlineOrNativeVoice(clean, isZh, rate);
    });
    return;
  }

  // 2. NẾU TRÊN GITHUB PAGES / ĐIỆN THOẠI DI ĐỘNG:
  playOnlineOrNativeVoice(clean, isZh, rate);
}

function playOnlineOrNativeVoice(clean, isZh, rate) {
  // Khi Online: Sử dụng âm thanh phòng thu phát thanh viên Bắc Kinh (Baidu TTS)
  if (navigator.onLine) {
    let audioSrc = '';
    if (isZh) {
      // Baidu TTS chuẩn phát thanh Bắc Kinh (đầy đủ âm cuốn lưỡi, chuẩn thanh 1 2 3 4)
      audioSrc = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(clean)}&spd=5&source=web`;
    } else {
      audioSrc = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=en&client=tw-ob`;
    }

    const player = new Audio();
    currentActiveAudioInstance = player;
    player.playbackRate = rate;

    let hasAudioStarted = false;
    const fallbackTimer = setTimeout(() => {
      if (!hasAudioStarted) {
        speakWithNativeTTS(clean, isZh ? 'zh' : 'en', rate);
      }
    }, 900);

    player.onplay = () => {
      hasAudioStarted = true;
      clearTimeout(fallbackTimer);
    };

    player.onerror = () => {
      clearTimeout(fallbackTimer);
      // Nếu Baidu gặp sự cố mạng, thử qua Google Translate zh
      if (isZh && !player.dataset.retried) {
        player.dataset.retried = '1';
        player.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=zh&client=tw-ob`;
        player.play().catch(() => speakWithNativeTTS(clean, 'zh', rate));
      } else {
        speakWithNativeTTS(clean, isZh ? 'zh' : 'en', rate);
      }
    };

    player.src = audioSrc;
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        clearTimeout(fallbackTimer);
        speakWithNativeTTS(clean, isZh ? 'zh' : 'en', rate);
      });
    }
    return;
  }

  // Khi Offline hoàn toàn: Dùng bộ máy TTS của hệ thống điện thoại
  speakWithNativeTTS(clean, isZh ? 'zh' : 'en', rate);
}

function speakCurrentWord() {
  if (filteredWords.length === 0) return;
  playAudioVoice(filteredWords[currentCharIndex].word, currentLang, speechRate || 1.0);
}

function speakSlowWord() {
  if (filteredWords.length === 0) return;
  playAudioVoice(filteredWords[currentCharIndex].word, currentLang, 0.75);
}

function speakCollocation() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCharIndex];
  const char = item.word;
  const details = getCharacterDetails(char, item);

  let sentenceText = details.collocZh ? details.collocZh.replace(/<[^>]*>/g, '') : item.example;
  if (!sentenceText) sentenceText = item.word;

  playAudioVoice(sentenceText, currentLang, 1.0);
}

function testQuickAudio() {
  if (currentLang === 'zh') {
    playAudioVoice('你好，很高兴认识你', 'zh', 1.0);
  } else {
    playAudioVoice('Hello, welcome to your language app!', 'en', 1.0);
  }
}

// ==================== CHI TIẾT & CÂU CHUYỆN CHỮ HÁN ====================
function renderCurrentCharacter() {
  if (filteredWords.length === 0) {
    document.getElementById('charBigDisplay').textContent = "无";
    document.getElementById('charMeaning').textContent = "Bộ từ này chưa có từ vựng nào!";
    document.getElementById('charPinyin').textContent = "--";
    document.getElementById('charDeckBadge').textContent = currentDeck === 'all' ? 'Tất cả' : currentDeck;
    return;
  }

  if (currentCharIndex >= filteredWords.length) currentCharIndex = 0;
  if (currentCharIndex < 0) currentCharIndex = filteredWords.length - 1;

  const item = filteredWords[currentCharIndex];
  const char = item.word;
  const details = getCharacterDetails(char, item);

  document.getElementById('charDeckBadge').textContent = item.deck || (currentDeck === 'all' ? 'Chung' : currentDeck);
  document.getElementById('charPinyin').textContent = details.pinyin || item.phonetic || "--";
  document.getElementById('charToneBadge').textContent = details.tone || "Thanh chuẩn";
  document.getElementById('charBigDisplay').textContent = char;
  document.getElementById('charMeaning').textContent = item.meaning || details.meaning || "--";
  document.getElementById('charHanViet').textContent = details.hanViet || deriveHanViet(char);

  document.getElementById('charRadical').textContent = details.radical.split('-')[0].trim();
  document.getElementById('charRadicalName').textContent = details.radical.includes('-') ? details.radical.split('-')[1].trim() : (details.radicalName || "Bộ thủ");
  document.getElementById('charStrokeCount').textContent = details.strokeCount;
  document.getElementById('charStrokeRule').textContent = details.strokeRule;

  // Watermark on canvas
  document.getElementById('canvasWatermark').textContent = char;
  document.getElementById('strokeProgressBadge').textContent = details.strokeCount;
  document.getElementById('charStoryText').textContent = details.story;

  // Stroke Order Row
  const strokeRow = document.getElementById('strokeOrderRow');
  const strokesList = Array.isArray(details.strokes) ? details.strokes : details.strokes.split(',').map(s => s.trim());
  strokeRow.innerHTML = strokesList.map((st, idx) => `
    <div onclick="speakCurrentWord()" class="shrink-0 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl p-2.5 text-center cursor-pointer transition active:scale-95 min-w-[70px]">
      <div class="font-hanzi text-red-700 text-lg font-bold">${char}</div>
      <div class="text-[10px] text-slate-600 font-medium mt-1 truncate">${st}</div>
    </div>
  `).join('');

  // Collocation
  document.getElementById('collocExampleZh').innerHTML = details.collocZh || item.example || `${char} 学习`;
  document.getElementById('collocExamplePinyin').textContent = details.collocPinyin || item.phonetic || "";
  document.getElementById('collocExampleVi').textContent = details.collocVi || item.meaning || "Ví dụ thực tế.";

  // Bookmark
  const btnBookmark = document.getElementById('btnBookmark');
  btnBookmark.className = item.favorite
    ? 'p-1.5 rounded-full text-red-700 bg-rose-50 border border-rose-300'
    : 'p-1.5 rounded-full text-slate-400 hover:text-red-600 bg-slate-50 border border-slate-200';

  clearCanvas();
}

function nextCharacter() {
  if (filteredWords.length === 0) return;
  currentCharIndex = (currentCharIndex + 1) % filteredWords.length;
  renderCurrentCharacter();
  speakCurrentWord();
}

function prevCharacter() {
  if (filteredWords.length === 0) return;
  currentCharIndex = (currentCharIndex - 1 + filteredWords.length) % filteredWords.length;
  renderCurrentCharacter();
  speakCurrentWord();
}

function toggleFavoriteCurrent() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCharIndex];
  item.favorite = !item.favorite;
  saveWordsToStorage(currentLang, allWords);
  renderCurrentCharacter();
  renderVocabList();
}

function deriveHanViet(char) {
  const map = {
    "爱": "ÁI", "学": "HỌC", "习": "TẬP", "好": "HẢO", "友": "HỮU", "朋": "BẰNG",
    "谢": "TẠ", "明": "MINH", "白": "BẠCH", "漂": "PHIÊU", "亮": "LƯỢNG", "成": "THÀNH",
    "功": "CÔNG", "努": "NỖ", "力": "LỰC", "欢": "HOAN", "迎": "NGHÊNH", "健": "KIỆN", "康": "KHANG"
  };
  return map[char] || "HÁN TỰ";
}

function estimateStrokes(char) {
  const map = { "爱": 10, "学": 8, "好": 6, "友": 4, "谢": 12, "明": 8, "你": 7, "我": 7, "他": 5 };
  return map[char] || 8;
}

// ==================== MODAL CHỈNH SỬA NÉT & CHI TIẾT CHỮ HÁN ====================
function openEditStrokeModal() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCharIndex];
  const char = item.word;
  const details = getCharacterDetails(char, item);

  document.getElementById('editCharWord').value = char;
  document.getElementById('editCharHanViet').value = details.hanViet || deriveHanViet(char);
  document.getElementById('editCharPinyin').value = details.pinyin || item.phonetic || "";
  document.getElementById('editCharTone').value = details.tone || "Thanh 4 (`)";
  document.getElementById('editCharRadical').value = details.radical || "";
  document.getElementById('editCharStrokeCount').value = details.strokeCount || "10 nét";

  // Strokes comma separated
  const strokesStr = Array.isArray(details.strokes) ? details.strokes.join(', ') : details.strokes;
  document.getElementById('editCharStrokes').value = strokesStr || "";

  document.getElementById('editCharStory').value = details.story || "";
  document.getElementById('editCharCollocZh').value = details.collocZh ? details.collocZh.replace(/<[^>]*>/g, '') : (item.example || "");
  document.getElementById('editCharCollocPinyin').value = details.collocPinyin || "";
  document.getElementById('editCharCollocVi').value = details.collocVi || item.meaning || "";

  document.getElementById('editStrokeModal').classList.remove('hidden');
}

function closeEditStrokeModal() {
  document.getElementById('editStrokeModal').classList.add('hidden');
}

function saveEditStrokeModal() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCharIndex];
  const char = item.word;

  const hanViet = document.getElementById('editCharHanViet').value.trim();
  const pinyin = document.getElementById('editCharPinyin').value.trim();
  const tone = document.getElementById('editCharTone').value.trim();
  const radical = document.getElementById('editCharRadical').value.trim();
  const strokeCount = document.getElementById('editCharStrokeCount').value.trim();
  const strokesInput = document.getElementById('editCharStrokes').value.trim();
  const story = document.getElementById('editCharStory').value.trim();
  const collocZh = document.getElementById('editCharCollocZh').value.trim();
  const collocPinyin = document.getElementById('editCharCollocPinyin').value.trim();
  const collocVi = document.getElementById('editCharCollocVi').value.trim();

  // Parse strokes into array
  const strokes = strokesInput.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 0);

  const customDB = getCustomHanziDB();
  customDB[char] = {
    pinyin: pinyin || item.phonetic,
    tone: tone || "Thanh chuẩn",
    meaning: item.meaning,
    hanViet: hanViet || deriveHanViet(char),
    radical: radical || "Bộ thủ",
    radicalName: radical.includes('-') ? radical.split('-')[1].trim() : "Bộ cấu thành",
    strokeCount: strokeCount || `${strokes.length} nét`,
    strokeRule: "Quy tắc chuẩn",
    story: story || "Ghi nhớ chữ theo cấu trúc các bộ.",
    strokes: strokes.length > 0 ? strokes : ["1. Nét đầu", "2. Nét tiếp theo"],
    collocZh: collocZh ? `<span class='text-red-700 underline underline-offset-4 decoration-2'>${char}</span> ${collocZh.replace(char, '').trim()}` : char,
    collocPinyin: collocPinyin,
    collocVi: collocVi
  };

  saveCustomHanziDB(customDB);
  closeEditStrokeModal();
  renderCurrentCharacter();
  alert('Đã lưu thành công chi tiết nét bút thuận và câu chuyện chữ Hán!');
}

// ==================== INTERACTIVE MǏZÌGÉ CANVAS (TOUCH & DRAW) & CHẤM ĐIỂM ====================
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let userDrawnStrokes = 0;
let hasDrawnOnCanvas = false;

function initCanvas() {
  canvas = document.getElementById('handwritingCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 9;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    userDrawnStrokes++;
    hasDrawnOnCanvas = true;
    updateStrokeBadge();
    hideScoreCard();
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    drawLine(lastX, lastY, lastX + 0.1, lastY + 0.1);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  });

  window.addEventListener('mouseup', () => { isDrawing = false; });

  // Touch
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    userDrawnStrokes++;
    hasDrawnOnCanvas = true;
    updateStrokeBadge();
    hideScoreCard();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    drawLine(lastX, lastY, lastX + 0.1, lastY + 0.1);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    drawLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDrawing = false;
  }, { passive: false });
}

function drawLine(x1, y1, x2, y2) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function updateStrokeBadge() {
  const badge = document.getElementById('strokeProgressBadge');
  if (!badge) return;
  if (filteredWords.length === 0) {
    badge.textContent = "0/0";
    return;
  }
  const item = filteredWords[currentCharIndex];
  const details = getCharacterDetails(item.word, item);
  const targetStrokes = parseInt(details.strokeCount) || estimateStrokes(item.word);
  badge.textContent = `${userDrawnStrokes}/${targetStrokes}`;
  if (userDrawnStrokes === targetStrokes) {
    badge.className = "text-emerald-700 font-bold";
  } else if (userDrawnStrokes > targetStrokes) {
    badge.className = "text-amber-700 font-bold";
  } else {
    badge.className = "text-rose-700 font-bold";
  }
}

function clearCanvas() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  userDrawnStrokes = 0;
  hasDrawnOnCanvas = false;
  updateStrokeBadge();
  hideScoreCard();
}

function hideScoreCard() {
  const card = document.getElementById('writingScoreCard');
  if (card) card.classList.add('hidden');
}

function showScoreResult(data) {
  const card = document.getElementById('writingScoreCard');
  if (!card) return;

  const scoreCircle = document.getElementById('scoreCircle');
  const scoreNumber = document.getElementById('scoreNumber');
  const scoreTitle = document.getElementById('scoreTitle');
  const scoreStars = document.getElementById('scoreStars');
  const scoreDesc = document.getElementById('scoreDesc');
  const scoreStrokes = document.getElementById('scoreStrokes');
  const scoreAccuracy = document.getElementById('scoreAccuracy');

  scoreNumber.textContent = data.score;
  scoreTitle.textContent = data.title;
  scoreStars.textContent = data.stars;
  scoreDesc.textContent = data.desc;

  if (data.userStrokes !== undefined) {
    scoreStrokes.textContent = `${data.userStrokes} / ${data.targetStrokes} nét`;
    scoreAccuracy.textContent = `${data.accuracy}%`;
  } else {
    scoreStrokes.textContent = `--`;
    scoreAccuracy.textContent = `--`;
  }

  if (data.color === 'emerald') {
    card.className = "mt-4 p-4 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white shadow-sm transition-all";
    scoreCircle.className = "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white bg-gradient-to-br from-emerald-600 to-teal-700 shadow-sm shrink-0";
    scoreTitle.className = "font-bold text-emerald-950 text-sm";
  } else if (data.color === 'teal') {
    card.className = "mt-4 p-4 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/90 via-slate-50 to-white shadow-sm transition-all";
    scoreCircle.className = "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white bg-teal-600 shadow-sm shrink-0";
    scoreTitle.className = "font-bold text-slate-900 text-sm";
  } else if (data.color === 'amber') {
    card.className = "mt-4 p-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white shadow-sm transition-all";
    scoreCircle.className = "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white bg-amber-600 shadow-sm shrink-0";
    scoreTitle.className = "font-bold text-amber-950 text-sm";
  } else {
    card.className = "mt-4 p-4 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white shadow-sm transition-all";
    scoreCircle.className = "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white bg-red-700 shadow-sm shrink-0";
    scoreTitle.className = "font-bold text-rose-950 text-sm";
  }

  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function gradeHandwriting() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentCharIndex];
  const char = item.word;
  const details = getCharacterDetails(char, item);
  const expectedStrokes = parseInt(details.strokeCount) || estimateStrokes(char);

  if (!hasDrawnOnCanvas || userDrawnStrokes === 0) {
    showScoreResult({
      score: 0,
      title: "Chưa có nét vẽ!",
      desc: "Hãy dùng ngón tay hoặc chuột viết chữ vào ô chữ Mễ trước khi bấm Chấm điểm nhé.",
      stars: "⚪⚪⚪",
      color: "amber"
    });
    return;
  }

  // Khởi tạo 2 canvas ảo kích thước 144x144 để so sánh điểm ảnh chính xác và cực nhanh
  const evalSize = 144;
  const modelCanvas = document.createElement('canvas');
  modelCanvas.width = evalSize;
  modelCanvas.height = evalSize;
  const mCtx = modelCanvas.getContext('2d');

  // Vẽ chữ mẫu vào modelCanvas
  mCtx.clearRect(0, 0, evalSize, evalSize);
  mCtx.fillStyle = '#000000';
  mCtx.textAlign = 'center';
  mCtx.textBaseline = 'middle';
  mCtx.font = `bold ${Math.round(evalSize * 0.72)}px "Kaiti", "STKaiti", "KaiTi_GB2312", "PingFang SC", "Microsoft YaHei", serif`;
  mCtx.fillText(char, evalSize / 2, evalSize / 2);

  // Thu nhỏ chữ người dùng viết vào userCanvas
  const userCanvas = document.createElement('canvas');
  userCanvas.width = evalSize;
  userCanvas.height = evalSize;
  const uCtx = userCanvas.getContext('2d');
  uCtx.clearRect(0, 0, evalSize, evalSize);
  uCtx.drawImage(canvas, 0, 0, evalSize, evalSize);

  const modelData = mCtx.getImageData(0, 0, evalSize, evalSize).data;
  const userData = uCtx.getImageData(0, 0, evalSize, evalSize).data;

  // Tạo mặt nạ chữ mẫu
  const isModelPixel = new Uint8Array(evalSize * evalSize);
  let totalModelPixels = 0;
  for (let i = 0; i < modelData.length; i += 4) {
    if (modelData[i + 3] > 35) {
      isModelPixel[i / 4] = 1;
      totalModelPixels++;
    }
  }

  // Giãn nhẹ mặt nạ mẫu (Dilation) bán kính 3px để hỗ trợ sai số tự nhiên của nét viết tay
  const dilatedModel = new Uint8Array(evalSize * evalSize);
  const r = 3;
  for (let y = 0; y < evalSize; y++) {
    for (let x = 0; x < evalSize; x++) {
      if (isModelPixel[y * evalSize + x]) {
        for (let dy = -r; dy <= r; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= evalSize) continue;
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= evalSize) continue;
            dilatedModel[ny * evalSize + nx] = 1;
          }
        }
      }
    }
  }

  let userPixels = 0;
  let hitPixels = 0;
  let outPixels = 0;
  let modelCoveredPixels = 0;

  for (let i = 0; i < userData.length; i += 4) {
    const idx = i / 4;
    const isUser = userData[i + 3] > 35;
    if (isUser) {
      userPixels++;
      if (dilatedModel[idx]) {
        hitPixels++;
      } else {
        outPixels++;
      }
    }
    if (isModelPixel[idx] && isUser) {
      modelCoveredPixels++;
    }
  }

  if (userPixels < 60) {
    showScoreResult({
      score: 30,
      title: "Nét chữ quá ít!",
      desc: "Bạn mới chỉ chấm hoặc vẽ một nét nhỏ. Hãy viết trọn vẹn cả chữ nhé.",
      stars: "⭐⚪⚪",
      color: "rose",
      userStrokes: userDrawnStrokes,
      targetStrokes: expectedStrokes,
      accuracy: 30
    });
    return;
  }

  // Độ khớp nét (Precision)
  const precision = hitPixels / (hitPixels + outPixels * 0.85);
  // Độ bao phủ chữ mẫu (Coverage)
  const coverage = totalModelPixels > 0 ? (modelCoveredPixels / totalModelPixels) : 0.5;

  // Độ chính xác về số nét bút
  const strokeDiff = Math.abs(userDrawnStrokes - expectedStrokes);
  let strokeFactor = 1.0;
  if (strokeDiff === 0) strokeFactor = 1.0;
  else if (strokeDiff <= 2) strokeFactor = 0.92;
  else if (strokeDiff <= 4) strokeFactor = 0.78;
  else strokeFactor = 0.62;

  // Tính điểm tổng hợp
  let rawScore = (precision * 0.52 + coverage * 0.33 + strokeFactor * 0.15) * 100;
  let finalScore = Math.min(100, Math.max(30, Math.round(rawScore * 1.15)));

  if (userDrawnStrokes === expectedStrokes && precision > 0.78) {
    finalScore = Math.max(finalScore, 90);
  }

  let title = "Đạt yêu cầu";
  let stars = "⭐⭐⚪";
  let color = "teal";
  let desc = "Chữ viết tương đối chuẩn dáng, bố cục hài hòa.";

  if (finalScore >= 90) {
    title = "Tuyệt phẩm thư pháp! 🌟";
    stars = "⭐⭐⭐";
    color = "emerald";
    desc = `Nét bút rất chuẩn xác (${finalScore}/100 điểm). Đã viết ${userDrawnStrokes}/${expectedStrokes} nét.`;
  } else if (finalScore >= 75) {
    title = "Rất tốt! Viết đẹp 👏";
    stars = "⭐⭐⭐";
    color = "emerald";
    desc = `Khung chữ cân đối, các nét khớp tốt với chữ mẫu (${finalScore} điểm).`;
  } else if (finalScore >= 60) {
    title = "Khá tốt! Cần đều tay 👍";
    stars = "⭐⭐⚪";
    color = "teal";
    desc = `Đã thành hình chữ. Bạn đã viết ${userDrawnStrokes} nét (chuẩn là ${expectedStrokes} nét). Cố gắng nắn nót hơn nhé!`;
  } else {
    title = "Cần nắn nót thêm ✍️";
    stars = "⭐⚪⚪";
    color = "rose";
    desc = `Nét viết còn hơi lệch khỏi khung chữ mẫu. Hãy bấm "Xem mẫu" để đồ lại nét cho quen tay nhé.`;
  }

  showScoreResult({
    score: finalScore,
    title,
    desc,
    stars,
    color,
    userStrokes: userDrawnStrokes,
    targetStrokes: expectedStrokes,
    accuracy: Math.round(precision * 100)
  });
}

function setWritingMode(mode) {
  writingMode = mode;
  const btnModel = document.getElementById('btnModeModel');
  const btnDraw = document.getElementById('btnModeDraw');
  const watermark = document.getElementById('canvasWatermark');

  if (mode === 'model') {
    btnModel.className = 'px-3 py-1 text-xs font-bold rounded-full bg-white text-red-700 shadow-sm transition flex items-center gap-1';
    btnDraw.className = 'px-3 py-1 text-xs font-bold rounded-full text-slate-500 hover:text-slate-800 transition flex items-center gap-1';
    watermark.style.opacity = '0.35';
  } else {
    btnDraw.className = 'px-3 py-1 text-xs font-bold rounded-full bg-white text-red-700 shadow-sm transition flex items-center gap-1';
    btnModel.className = 'px-3 py-1 text-xs font-bold rounded-full text-slate-500 hover:text-slate-800 transition flex items-center gap-1';
    watermark.style.opacity = '0.07';
  }
}

// ==================== TRANG CHỦ / ÔN LUYỆN GÕ TỪ (DRILL) ====================
function renderHomeDrill() {
  if (filteredWords.length === 0) {
    document.getElementById('homePromptMeaning').textContent = 'Chưa có từ vựng nào trong bộ này!';
    document.getElementById('homeChineseChar').textContent = '--';
    document.getElementById('drillIndexDisplay').textContent = '0/0';
    return;
  }

  if (currentDrillIndex >= filteredWords.length) currentDrillIndex = 0;
  const item = filteredWords[currentDrillIndex];

  document.getElementById('drillIndexDisplay').textContent = `${currentDrillIndex + 1}/${filteredWords.length}`;
  document.getElementById('homePromptMeaning').textContent = item.meaning;
  document.getElementById('homeChineseChar').textContent = item.word;

  const input = document.getElementById('homeDrillInput');
  input.value = '';
  input.className = 'w-full bg-slate-50 border-2 border-slate-200 focus:border-red-600 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition';

  const fb = document.getElementById('homeDrillFeedback');
  fb.classList.add('hidden');
}

function checkHomeDrillAnswer() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentDrillIndex];
  const input = document.getElementById('homeDrillInput');
  const val = input.value.trim();
  const fb = document.getElementById('homeDrillFeedback');

  if (!val) {
    input.focus();
    return;
  }

  let isMatch = false;
  if (currentLang === 'zh') {
    isMatch = matchPinyin(val, item.phonetic);
  } else {
    isMatch = val.toLowerCase() === item.word.toLowerCase();
  }

  if (isMatch) {
    input.className = 'w-full bg-emerald-50 border-2 border-emerald-500 rounded-2xl px-4 py-3.5 text-base font-bold text-emerald-800 focus:outline-none transition';
    fb.className = 'p-3 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 block';
    fb.innerHTML = `🎉 <strong>Chính xác!</strong> ${item.word} ${item.phonetic ? `(${item.phonetic})` : ''}`;
    playAudioVoice(item.word, currentLang, 1.0);
    setTimeout(() => { nextHomeDrill(); }, 1200);
  } else {
    input.className = 'w-full bg-rose-50 border-2 border-rose-500 rounded-2xl px-4 py-3.5 text-base font-bold text-rose-800 focus:outline-none transition';
    fb.className = 'p-3 rounded-2xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 block';
    fb.innerHTML = `❌ Chưa chính xác. Đáp án đúng: <strong class="text-red-700">${currentLang === 'zh' ? item.phonetic : item.word}</strong>`;
  }
}

function matchPinyin(userInput, target) {
  if (!target) return false;
  const toneMap = { 'ā':'a','á':'a','ǎ':'a','à':'a','ē':'e','é':'e','ě':'e','è':'e','ī':'i','í':'i','ǐ':'i','ì':'i','ō':'o','ó':'o','ǒ':'o','ò':'o','ū':'u','ú':'u','ǔ':'u','ù':'u','ü':'v' };
  
  const cleanU = userInput.toLowerCase().replace(/[\s,\.?!;]/g, '');
  const cleanT = target.toLowerCase().replace(/[\s,\.?!;]/g, '');
  if (cleanU === cleanT) return true;

  const bareU = cleanU.split('').map(c => toneMap[c] || c).join('').replace(/[1-5]/g, '');
  const bareT = cleanT.split('').map(c => toneMap[c] || c).join('').replace(/[1-5]/g, '');
  return bareU === bareT;
}

function nextHomeDrill() {
  if (filteredWords.length === 0) return;
  currentDrillIndex = (currentDrillIndex + 1) % filteredWords.length;
  renderHomeDrill();
  const input = document.getElementById('homeDrillInput');
  if (input) input.focus();
}

function skipHomeDrill() {
  nextHomeDrill();
}

function speakCurrentDrillWord() {
  if (filteredWords.length === 0) return;
  playAudioVoice(filteredWords[currentDrillIndex].word, currentLang, 1.0);
}

// ==================== KHO TỪ VỰNG ====================
function renderVocabList() {
  const container = document.getElementById('vocabListContainer');
  const q = (document.getElementById('vocabSearchInput')?.value || '').toLowerCase().trim();

  let list = filteredWords.filter(item => {
    if (!q) return true;
    return item.word.toLowerCase().includes(q) ||
           (item.phonetic && item.phonetic.toLowerCase().includes(q)) ||
           item.meaning.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400 text-xs">
        <p class="text-3xl mb-1">🔍</p>
        <p>Không có từ vựng nào trong bộ này.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, idx) => `
    <div class="bg-white rounded-2xl p-3.5 border border-rose-100/70 shadow-2xs flex items-center justify-between gap-2 hover:border-red-200 transition">
      <div class="flex-1 min-w-0 cursor-pointer" onclick="selectCharByIndex(${idx})">
        <div class="flex items-baseline gap-2">
          <span class="font-hanzi text-lg font-bold text-red-700 truncate">${item.word}</span>
          ${item.phonetic ? `<span class="text-xs font-semibold text-amber-800">${item.phonetic}</span>` : ''}
          <span class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-md font-bold">${item.deck || 'Chung'}</span>
        </div>
        <div class="text-xs text-slate-700 truncate mt-0.5">${item.meaning}</div>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button onclick="playAudioVoice('${escapeStr(item.word)}', '${currentLang}', 1.0)" class="p-2 text-slate-400 hover:text-red-700 hover:bg-rose-50 rounded-xl transition" title="Nghe phát âm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        </button>

        <button onclick="deleteWordItem('${item.id}')" class="p-2 text-slate-300 hover:text-red-600 hover:bg-rose-50 rounded-xl transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function selectCharByIndex(idx) {
  currentCharIndex = idx;
  switchTab('writing');
}

function deleteWordItem(id) {
  if (confirm('Bạn có muốn xóa từ này khỏi kho không?')) {
    allWords = allWords.filter(w => w.id !== id);
    saveWordsToStorage(currentLang, allWords);
    applyDeckFilter();
  }
}

function escapeStr(s) {
  if (!s) return '';
  return s.replace(/'/g, "\\'");
}

// ==================== THÊM TỪ THỦ CÔNG ====================
function openWordModal() {
  document.getElementById('modalHeading').textContent = currentLang === 'zh' ? 'Thêm từ tiếng Trung' : 'Thêm từ tiếng Anh';
  document.getElementById('modalWordId').value = '';
  document.getElementById('modalInputWord').value = '';
  document.getElementById('modalInputPhonetic').value = '';
  document.getElementById('modalInputMeaning').value = '';
  document.getElementById('modalInputExample').value = '';
  document.getElementById('modalDeckSelect').value = currentDeck === 'all' ? (loadDecksFromStorage(currentLang)[0] || "HSK 1") : currentDeck;
  document.getElementById('wordModal').classList.remove('hidden');
}

function closeWordModal() {
  document.getElementById('wordModal').classList.add('hidden');
}

function saveWordModal() {
  const w = document.getElementById('modalInputWord').value.trim();
  const p = document.getElementById('modalInputPhonetic').value.trim();
  const m = document.getElementById('modalInputMeaning').value.trim();
  const ex = document.getElementById('modalInputExample').value.trim();
  const deck = document.getElementById('modalDeckSelect').value;

  if (!w || !m) {
    alert('Vui lòng nhập Từ/Chữ Hán và Nghĩa tiếng Việt!');
    return;
  }

  allWords.unshift({
    id: `${currentLang}_${Date.now()}`,
    lang: currentLang,
    word: w,
    phonetic: p,
    meaning: m,
    example: ex,
    deck: deck,
    favorite: false
  });

  saveWordsToStorage(currentLang, allWords);
  closeWordModal();
  updateDeckDropdowns();
  applyDeckFilter();
}

// ==================== NHẬP TỪ THEO TAB VÀO BỘ CHỈ ĐỊNH ====================
let tempParsed = [];

function fillSampleToImportBox() {
  const zhSamples = [
    "朋友\tpéngyou\tbạn bè, người bạn\t他是我的好朋友。(Anh ấy là bạn tốt của tôi.)",
    "工作\tgōngzuò\tcông việc, làm việc\t我很喜欢这份工作。(Tôi rất thích công việc này.)",
    "开心\tkāixīn\tvui vẻ, hân hoan\t今天大家都很开心。(Hôm nay mọi người đều rất vui.)",
    "学习\txuéxí\thọc tập, nghiên cứu\t学习汉语很有趣。(Học tiếng Trung rất thú vị.)",
    "谢谢\txièxie\tcảm ơn\t谢谢你的热情帮助。(Cảm ơn sự nhiệt tình giúp đỡ của bạn.)"
  ];

  const enSamples = [
    "resilient\t/rɪˈzɪl.jənt/\tkiên cường, phục hồi nhanh\tShe is very resilient and never gives up.",
    "collaborate\t/kəˈlæb.ə.reɪt/\thợp tác, cộng tác làm việc\tWe need to collaborate with each other.",
    "inspire\t/ɪnˈspaɪər/\ttruyền cảm hứng, khích lệ\tHis speech will inspire many young minds.",
    "achieve\t/əˈtʃiːv/\tđạt được, hoàn thành mục tiêu\tWork hard to achieve your biggest dream.",
    "confidence\t/ˈkɒn.fɪ.dəns/\tsự tự tin, lòng tin\tRegular practice boosts your confidence."
  ];

  const list = currentLang === 'zh' ? zhSamples : enSamples;
  const box = document.getElementById('importBox');
  if (box) {
    box.value = list.join('\n');
    previewTabImport();
  }
}

function previewTabImport() {
  const raw = document.getElementById('importBox').value;
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  tempParsed = [];

  for (const line of lines) {
    let parts = line.includes('\t') ? line.split('\t') : (line.includes('|') ? line.split('|') : line.split(','));
    parts = parts.map(p => p.trim());
    if (parts.length >= 2) {
      const word = parts[0];
      const phonetic = parts.length >= 3 ? parts[1] : '';
      const meaning = parts.length >= 3 ? parts[2] : parts[1];
      const example = parts.length >= 4 ? parts.slice(3).join(' ') : '';
      if (word && meaning) {
        tempParsed.push({ word, phonetic, meaning, example });
      }
    }
  }

  if (tempParsed.length === 0) {
    alert('Không nhận diện được từ nào hợp lệ! Đảm bảo mỗi dòng cách nhau bằng 1 phím Tab.');
    return;
  }

  document.getElementById('tabPreviewCount').textContent = tempParsed.length;
  document.getElementById('tabPreviewList').innerHTML = tempParsed.slice(0, 10).map((t, i) => `
    <div>${i + 1}. <strong>${t.word}</strong> (${t.phonetic}) : ${t.meaning}</div>
  `).join('');
  document.getElementById('tabPreviewArea').classList.remove('hidden');
}

function saveTabImport() {
  if (tempParsed.length === 0) return;
  const targetDeck = document.getElementById('importTargetDeck').value;

  const newItems = tempParsed.map((item, idx) => ({
    id: `${currentLang}_${Date.now()}_${idx}`,
    lang: currentLang,
    word: item.word,
    phonetic: item.phonetic,
    meaning: item.meaning,
    example: item.example,
    deck: targetDeck,
    favorite: false
  }));

  allWords = [...newItems, ...allWords];
  saveWordsToStorage(currentLang, allWords);

  document.getElementById('importBox').value = '';
  document.getElementById('tabPreviewArea').classList.add('hidden');
  tempParsed = [];

  currentDeck = targetDeck;
  updateDeckDropdowns();
  applyDeckFilter();
  alert(`Đã nạp thành công ${newItems.length} từ vào bộ "${targetDeck}"!`);
  switchTab('writing');
}

function handleFileImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    document.getElementById('importBox').value = evt.target.result;
    previewTabImport();
  };
  reader.readAsText(file, 'UTF-8');
}

function loadSampleStarter(lang) {
  const list = lang === 'zh' ? STARTER_ZH : STARTER_EN;
  const items = list.map((w, i) => ({
    id: `${lang}_s_${Date.now()}_${i}`,
    lang: lang,
    word: w.word,
    phonetic: w.phonetic,
    meaning: w.meaning,
    example: w.example,
    deck: w.deck || "Chung",
    favorite: false
  }));

  allWords = [...items, ...allWords];
  saveWordsToStorage(lang, allWords);

  if (currentLang === lang) {
    updateDeckDropdowns();
    applyDeckFilter();
  }
  alert(`Đã nạp bộ từ mẫu ${lang === 'zh' ? 'Tiếng Trung' : 'Tiếng Anh'}!`);
}

// ==================== SAO LƯU ====================
function exportBackupData() {
  const backup = {
    app: 'HanyuGo-LinguaMaster',
    exportDate: new Date().toISOString(),
    zh: loadWordsFromStorage('zh') || [],
    en: loadWordsFromStorage('en') || [],
    decks_zh: loadDecksFromStorage('zh'),
    decks_en: loadDecksFromStorage('en'),
    custom_hanzi: getCustomHanziDB()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `hanyugo_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function restoreBackupData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (data.zh) saveWordsToStorage('zh', data.zh);
      if (data.en) saveWordsToStorage('en', data.en);
      if (data.decks_zh) saveDecksToStorage('zh', data.decks_zh);
      if (data.decks_en) saveDecksToStorage('en', data.decks_en);
      if (data.custom_hanzi) saveCustomHanziDB(data.custom_hanzi);
      loadLanguage(currentLang);
      alert('Khôi phục dữ liệu thành công!');
    } catch (err) {
      alert('File sao lưu không hợp lệ!');
    }
  };
  r.readAsText(file, 'UTF-8');
}

// ==================== LUYỆN PHÁT ÂM (PRONUNCIATION & PINYIN ENGINE) ====================
let currentPronounceIndex = 0;
let pronounceMode = 'word'; // 'word' | 'free'
let pronounceRecognition = null;
let isPronounceRecording = false;
let freeRecognition = null;
let isFreeRecording = false;

let currentHardGroupIndex = 0;
let currentHardWordIndex = 0;
let hardRecognition = null;
let isHardRecording = false;

const HARD_SOUNDS_DATA = [
  {
    id: 'zcs',
    name: 'z, c, s + ư',
    title: 'Nhóm 1: z, c, s + i',
    sub: 'Đọc âm "ư" (dẹt miệng, đầu lưỡi chạm răng dưới)',
    tip: '💡 Khẩu hình: Hai hàm răng khép nhẹ, khóe miệng kéo dẹt sang hai bên như đang mỉm cười. Đầu lưỡi thẳng dí vào chân răng dưới. Riêng chữ "c" phải BẬT HƠI thật mạnh!',
    contrast: '⚡ So sánh: zi (tư) vs ci (thư - bật hơi) vs si (xư - xì nhẹ)',
    words: [
      { word: '字', phonetic: 'zì', meaning: 'Chữ, ký tự', rule: 'z + i (thanh 4) - Đọc dứt khoát "tứ"' },
      { word: '紫', phonetic: 'zǐ', meaning: 'Màu tím', rule: 'z + i (thanh 3) - Hạ giọng "tử"' },
      { word: '自己', phonetic: 'zì jǐ', meaning: 'Tự mình, bản thân', rule: 'zì + jǐ - Luyện ghép z và j' },
      { word: '次', phonetic: 'cì', meaning: 'Lần, thứ', rule: 'c + i (thanh 4) - BẬT HƠI mạnh "thứ"' },
      { word: '从', phonetic: 'cóng', meaning: 'Từ (đâu đến)', rule: 'c + ong - Bật hơi "thoóng"' },
      { word: '四', phonetic: 'sì', meaning: 'Số 4', rule: 's + i (thanh 4) - Đọc "sứ" không uốn lưỡi' },
      { word: '司机', phonetic: 'sī jī', meaning: 'Tài xế, lái xe', rule: 'sī + jī - Phân biệt s dẹt vs j mặt lưỡi' },
      { word: '三', phonetic: 'sān', meaning: 'Số 3', rule: 's + an - Dẹt miệng' }
    ]
  },
  {
    id: 'zhchsh',
    name: 'zh, ch, sh + ư',
    title: 'Nhóm 2: zh, ch, sh, r + i',
    sub: 'Đọc âm "ư" (UỐN LƯỠI lên ngạc trên, miệng tròn hơi)',
    tip: '💡 Khẩu hình: Cong đầu lưỡi uốn lên vòm họng trên (không chạm hẳn). Không dẹt miệng mà hơi tròn môi. Riêng "ch" phải BẬT HƠI mạnh từ cuống họng. "r" phát âm rung nhẹ gần như chữ "r" tiếng Việt!',
    contrast: '⚡ So sánh tương phản: si (dẹt miệng) vs shi (uốn lưỡi); zi (thẳng lưỡi) vs zhi (uốn lưỡi)',
    words: [
      { word: '是', phonetic: 'shì', meaning: 'Là, đúng vậy', rule: 'sh + i (thanh 4) - Uốn lưỡi đọc "sự / sứt"' },
      { word: '十', phonetic: 'shí', meaning: 'Số 10', rule: 'sh + i (thanh 2) - Lên giọng "sứ"' },
      { word: '老师', phonetic: 'lǎo shī', meaning: 'Thầy / Cô giáo', rule: 'shī (thanh 1) - Kéo dài ngang tai' },
      { word: '吃', phonetic: 'chī', meaning: 'Ăn cơm', rule: 'ch + i (thanh 1) - Uốn lưỡi + BẬT HƠI mạnh' },
      { word: '出', phonetic: 'chū', meaning: 'Ra ngoài', rule: 'ch + u - Bật hơi mạnh' },
      { word: '知', phonetic: 'zhī', meaning: 'Biết, tri thức', rule: 'zh + i (thanh 1) - Uốn lưỡi không bật hơi "trư"' },
      { word: '这', phonetic: 'zhè', meaning: 'Đây, này', rule: 'zh + e - Đọc "trợ"' },
      { word: '日', phonetic: 'rì', meaning: 'Ngày, mặt trời', rule: 'r + i (thanh 4) - Rung nhẹ uốn lưỡi' },
      { word: '人', phonetic: 'rén', meaning: 'Người, con người', rule: 'r + en - Uốn lưỡi' }
    ]
  },
  {
    id: 'jqx',
    name: 'j, q, x + i',
    title: 'Nhóm 3: j, q, x + i',
    sub: 'Đọc âm "i" (áp MẶT LƯỠI lên ngạc cứng)',
    tip: '💡 Khẩu hình: Mặt trước của lưỡi ép sát lên vòm họng ngạc cứng trên. Tuyệt đối không uốn lưỡi. Riêng "q" là âm khó nhất: bật luồng hơi cực mạnh qua khe mặt lưỡi nghe như "t-xi"!',
    contrast: '⚡ So sánh: ji (chi) vs qi (bật hơi cực mạnh) vs xi (xi nhẹ)',
    words: [
      { word: '鸡', phonetic: 'jī', meaning: 'Con gà', rule: 'j + i (thanh 1) - Mặt lưỡi đọc "chi"' },
      { word: '几', phonetic: 'jǐ', meaning: 'Mấy, vài', rule: 'j + i (thanh 3) - Hạ giọng "chỉ"' },
      { word: '今天', phonetic: 'jīn tiān', meaning: 'Hôm nay', rule: 'jīn + tiān' },
      { word: '七', phonetic: 'qī', meaning: 'Số 7', rule: 'q + i (thanh 1) - BẬT HƠI CỰC MẠNH "t-xii"' },
      { word: '请', phonetic: 'qǐng', meaning: 'Xin mời', rule: 'q + ing - Bật hơi mạnh' },
      { word: '去', phonetic: 'qù', meaning: 'Đi', rule: 'q + u (tròn môi ü) - Bật hơi' },
      { word: '西', phonetic: 'xī', meaning: 'Phía tây', rule: 'x + i (thanh 1) - Mặt lưỡi đọc "xi"' },
      { word: '洗', phonetic: 'xǐ', meaning: 'Rửa, giặt', rule: 'x + i (thanh 3) - Hạ giọng "xỉ"' },
      { word: '谢谢', phonetic: 'xiè xie', meaning: 'Cảm ơn', rule: 'xiè + xie - Dứt khoát thanh 4' },
      { word: '喜欢', phonetic: 'xǐ huan', meaning: 'Thích, yêu thích', rule: 'xǐ + huan' }
    ]
  }
];

function setPronounceMode(mode) {
  pronounceMode = mode;
  const btnWord = document.getElementById('btnPronounceModeWord');
  const btnHard = document.getElementById('btnPronounceModeHard');
  const btnFree = document.getElementById('btnPronounceModeFree');
  const viewWord = document.getElementById('pronounceWordView');
  const viewHard = document.getElementById('pronounceHardView');
  const viewFree = document.getElementById('pronounceFreeView');

  // Dừng thu âm nếu đang chạy
  stopPronounceRecording();
  stopHardRecording();
  stopFreeRecording();

  const activeBtnClass = "flex-1 py-1.5 rounded-full bg-white text-red-700 shadow-sm transition flex items-center justify-center gap-1 text-[11px] sm:text-xs";
  const inactiveBtnClass = "flex-1 py-1.5 rounded-full text-slate-500 hover:text-slate-800 transition flex items-center justify-center gap-1 text-[11px] sm:text-xs";

  if (btnWord) btnWord.className = (mode === 'word') ? activeBtnClass : inactiveBtnClass;
  if (btnHard) btnHard.className = (mode === 'hard') ? activeBtnClass : inactiveBtnClass;
  if (btnFree) btnFree.className = (mode === 'free') ? activeBtnClass : inactiveBtnClass;

  if (viewWord) viewWord.classList.toggle('hidden', mode !== 'word');
  if (viewHard) viewHard.classList.toggle('hidden', mode !== 'hard');
  if (viewFree) viewFree.classList.toggle('hidden', mode !== 'free');

  if (mode === 'word') {
    renderPronounceWord();
  } else if (mode === 'hard') {
    renderHardGroup();
  }
}

function selectHardGroup(idx) {
  currentHardGroupIndex = idx;
  currentHardWordIndex = 0;
  stopHardRecording();
  renderHardGroup();
}

function renderHardGroup() {
  const group = HARD_SOUNDS_DATA[currentHardGroupIndex];
  if (!group) return;

  // Cập nhật 3 nút tab nhóm
  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`btnHardGroup${i}`);
    if (btn) {
      if (i === currentHardGroupIndex) {
        btn.className = "py-2 px-1 rounded-2xl bg-red-700 text-white font-bold text-xs shadow-sm transition active:scale-95 text-center flex flex-col items-center";
      } else {
        btn.className = "py-2 px-1 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs transition active:scale-95 text-center flex flex-col items-center";
      }
    }
  }

  // Cập nhật card hướng dẫn khẩu hình
  const titleEl = document.getElementById('hardGroupTitle');
  const subEl = document.getElementById('hardGroupSub');
  const tipEl = document.getElementById('hardGroupTip');
  const contrastEl = document.getElementById('hardGroupContrast');

  if (titleEl) titleEl.innerHTML = `<span>👄</span> <span>${group.title}</span>`;
  if (subEl) subEl.textContent = group.sub;
  if (tipEl) tipEl.textContent = group.tip;
  if (contrastEl) contrastEl.textContent = group.contrast;

  // Cập nhật từ đang active
  renderHardActiveWord();

  // Render danh sách từ
  const grid = document.getElementById('hardWordsGrid');
  if (grid) {
    grid.innerHTML = group.words.map((item, wIdx) => {
      const isSelected = (wIdx === currentHardWordIndex);
      const activeClass = isSelected ? 'border-red-600 bg-rose-50/60 shadow-xs' : 'border-slate-200 bg-white hover:border-rose-200';
      return `
        <div onclick="selectHardWord(${wIdx})" class="flex items-center justify-between p-2.5 rounded-2xl border ${activeClass} transition cursor-pointer active:scale-98">
          <div class="flex items-center gap-3">
            <span class="font-hanzi text-2xl font-bold text-red-700 w-8 text-center">${item.word}</span>
            <div>
              <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span class="text-amber-600 font-extrabold">${item.phonetic}</span>
                <span class="text-[10px] text-slate-400 font-normal">(${item.meaning})</span>
              </div>
              <div class="text-[10px] text-slate-500">${item.rule}</div>
            </div>
          </div>
          <button onclick="event.stopPropagation(); playAudioVoice('${item.word}', 'zh', 0.85);" class="w-7 h-7 rounded-full bg-rose-100 hover:bg-rose-200 text-red-700 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition" title="Nghe phát âm">
            🔊
          </button>
        </div>
      `;
    }).join('');
  }
}

function selectHardWord(wIdx) {
  currentHardWordIndex = wIdx;
  stopHardRecording();
  renderHardActiveWord();
  renderHardGroup();
}

function renderHardActiveWord() {
  const group = HARD_SOUNDS_DATA[currentHardGroupIndex];
  if (!group || !group.words[currentHardWordIndex]) return;
  const item = group.words[currentHardWordIndex];

  const wordEl = document.getElementById('hardActiveWord');
  const pinyinEl = document.getElementById('hardActivePinyin');
  const meaningEl = document.getElementById('hardActiveMeaning');
  const ruleEl = document.getElementById('hardActiveRule');
  const resultBox = document.getElementById('hardResultBox');
  const statusEl = document.getElementById('hardStatusText');

  if (wordEl) wordEl.textContent = item.word;
  if (pinyinEl) pinyinEl.textContent = item.phonetic;
  if (meaningEl) meaningEl.textContent = item.meaning;
  if (ruleEl) ruleEl.textContent = item.rule;

  if (resultBox) resultBox.classList.add('hidden');
  if (statusEl && !isHardRecording) {
    statusEl.textContent = 'Bấm nút Micro và đọc vào máy';
    statusEl.className = 'text-[11px] font-semibold text-slate-400';
  }
}

function speakHardActiveWord() {
  const group = HARD_SOUNDS_DATA[currentHardGroupIndex];
  if (!group || !group.words[currentHardWordIndex]) return;
  playAudioVoice(group.words[currentHardWordIndex].word, 'zh', 0.85);
}

function toggleHardRecording() {
  if (isHardRecording) {
    stopHardRecording();
  } else {
    startHardRecording();
  }
}

function startHardRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('hardStatusText');
  const micBtn = document.getElementById('btnHardMic');

  if (!SpeechRecognition) {
    alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Vui lòng mở bằng Google Chrome hoặc Microsoft Edge!');
    return;
  }

  const group = HARD_SOUNDS_DATA[currentHardGroupIndex];
  if (!group || !group.words[currentHardWordIndex]) return;
  const targetItem = group.words[currentHardWordIndex];

  try {
    hardRecognition = new SpeechRecognition();
    hardRecognition.lang = 'zh-CN';
    hardRecognition.continuous = false;
    hardRecognition.interimResults = false;

    hardRecognition.onstart = () => {
      isHardRecording = true;
      if (micBtn) micBtn.classList.add('btn-recording');
      if (statusEl) {
        statusEl.textContent = `🔴 Đang nghe... Hãy đọc: "${targetItem.word}" (${targetItem.phonetic})!`;
        statusEl.className = 'text-[11px] font-bold text-red-600 animate-pulse';
      }
    };

    hardRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const result = gradePronunciationMatch(targetItem, transcript);
      displayHardFeedback(result, targetItem);
    };

    hardRecognition.onerror = (event) => {
      console.warn('Hard recognition error:', event.error);
      stopHardRecording();
    };

    hardRecognition.onend = () => {
      stopHardRecording();
    };

    hardRecognition.start();
  } catch (err) {
    console.error('Hard start error:', err);
    stopHardRecording();
  }
}

function stopHardRecording() {
  isHardRecording = false;
  const micBtn = document.getElementById('btnHardMic');
  const statusEl = document.getElementById('hardStatusText');

  if (micBtn) micBtn.classList.remove('btn-recording');
  if (statusEl && !statusEl.textContent.includes('chuẩn') && !statusEl.textContent.includes('đúng')) {
    statusEl.textContent = 'Bấm nút Micro và đọc vào máy';
    statusEl.className = 'text-[11px] font-semibold text-slate-400';
  }

  if (hardRecognition) {
    try {
      hardRecognition.abort();
    } catch(e) {}
    hardRecognition = null;
  }
}

function displayHardFeedback(result, targetItem) {
  const box = document.getElementById('hardResultBox');
  const badge = document.getElementById('hardResultBadge');
  const scoreEl = document.getElementById('hardResultScore');
  const heardEl = document.getElementById('hardResultHeard');
  const pinyinEl = document.getElementById('hardResultPinyin');
  const statusEl = document.getElementById('hardStatusText');

  if (!box) return;
  box.classList.remove('hidden');

  if (heardEl) heardEl.textContent = result.spokenHanzi;
  if (pinyinEl) pinyinEl.textContent = result.spokenPinyin;

  if (result.score >= 85) {
    box.className = "p-3 rounded-2xl border text-left space-y-1 text-xs bg-emerald-50 border-emerald-200";
    badge.textContent = "🎉 Chuẩn 100%!";
    badge.className = "text-emerald-800 font-extrabold";
    scoreEl.textContent = `${result.score}/100`;
    scoreEl.className = "text-emerald-700 font-black";
    if (statusEl) {
      statusEl.textContent = "✅ Phát âm chính xác âm khó này!";
      statusEl.className = "text-[11px] font-bold text-emerald-600";
    }
  } else if (result.score >= 60) {
    box.className = "p-3 rounded-2xl border text-left space-y-1 text-xs bg-amber-50 border-amber-200";
    badge.textContent = "⚠️ Gần được rồi!";
    badge.className = "text-amber-800 font-extrabold";
    scoreEl.textContent = `${result.score}/100`;
    scoreEl.className = "text-amber-700 font-black";
    if (statusEl) {
      statusEl.textContent = `Bạn vừa đọc là: "${result.spokenPinyin}". Chú ý khẩu hình môi & lưỡi!`;
      statusEl.className = "text-[11px] font-bold text-amber-600";
    }
  } else {
    box.className = "p-3 rounded-2xl border text-left space-y-1 text-xs bg-rose-50 border-rose-200";
    badge.textContent = "❌ Chưa chuẩn!";
    badge.className = "text-rose-800 font-extrabold";
    scoreEl.textContent = `${result.score}/100`;
    scoreEl.className = "text-rose-700 font-black";
    if (statusEl) {
      statusEl.textContent = `Máy nghe được là: "${result.spokenHanzi}" (${result.spokenPinyin}). Hãy nghe lại mẫu!`;
      statusEl.className = "text-[11px] font-bold text-rose-600";
    }
  }
}

function openPronounceForCurrentWord() {
  currentPronounceIndex = currentCharIndex;
  switchTab('pronounce');
  setPronounceMode('word');
}

function renderPronounceWord() {
  if (!filteredWords || filteredWords.length === 0) {
    const targetWordEl = document.getElementById('pronounceTargetWord');
    if (targetWordEl) targetWordEl.textContent = 'Trống';
    return;
  }

  if (currentPronounceIndex >= filteredWords.length) currentPronounceIndex = 0;
  if (currentPronounceIndex < 0) currentPronounceIndex = filteredWords.length - 1;

  const item = filteredWords[currentPronounceIndex];
  const targetWordEl = document.getElementById('pronounceTargetWord');
  const targetPinyinEl = document.getElementById('pronounceTargetPinyin');
  const targetMeaningEl = document.getElementById('pronounceTargetMeaning');
  const progressEl = document.getElementById('pronounceProgress');
  const deckBadgeEl = document.getElementById('pronounceDeckBadge');
  const feedbackBox = document.getElementById('pronounceFeedbackBox');

  if (targetWordEl) targetWordEl.textContent = item.word;
  if (targetPinyinEl) targetPinyinEl.textContent = item.phonetic || item.word;
  if (targetMeaningEl) targetMeaningEl.textContent = item.meaning || '';
  if (progressEl) progressEl.textContent = `${currentPronounceIndex + 1}/${filteredWords.length}`;
  if (deckBadgeEl) deckBadgeEl.textContent = item.deck || (currentLang === 'zh' ? 'HSK' : 'Cơ bản');

  // Ẩn kết quả chấm điểm cũ khi chuyển sang từ mới
  if (feedbackBox) feedbackBox.classList.add('hidden');

  // Đặt lại chữ trạng thái micro
  const statusEl = document.getElementById('pronounceStatusText');
  if (statusEl && !isPronounceRecording) {
    statusEl.textContent = 'Chạm vào Micro để bắt đầu nói';
    statusEl.className = 'text-xs font-semibold text-slate-400 mt-2';
  }
}

function prevPronounceWord() {
  stopPronounceRecording();
  if (filteredWords.length === 0) return;
  currentPronounceIndex = (currentPronounceIndex - 1 + filteredWords.length) % filteredWords.length;
  renderPronounceWord();
}

function nextPronounceWord() {
  stopPronounceRecording();
  if (filteredWords.length === 0) return;
  currentPronounceIndex = (currentPronounceIndex + 1) % filteredWords.length;
  renderPronounceWord();
}

function randomPronounceWord() {
  stopPronounceRecording();
  if (filteredWords.length <= 1) return;
  let newIdx;
  do {
    newIdx = Math.floor(Math.random() * filteredWords.length);
  } while (newIdx === currentPronounceIndex);
  currentPronounceIndex = newIdx;
  renderPronounceWord();
}

function speakPronounceTarget() {
  if (filteredWords.length === 0) return;
  const item = filteredWords[currentPronounceIndex];
  playAudioVoice(item.word, currentLang, 0.85);
}

// Chuyển chữ Hán sang Pinyin có dấu thanh điệu
function convertToPinyin(text) {
  if (window.pinyinPro && window.pinyinPro.pinyin) {
    try {
      return window.pinyinPro.pinyin(text, { toneType: 'symbol' });
    } catch(e) {
      return text;
    }
  }
  return text;
}

// Chuẩn hóa chuỗi để so sánh
function cleanSpeechString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'，。！？]/g, '')
    .replace(/\s+/g, '').trim();
}

// Chấm điểm phát âm
function gradePronunciationMatch(targetItem, spokenText) {
  const isZh = (currentLang === 'zh');
  const spokenClean = cleanSpeechString(spokenText);
  const targetClean = cleanSpeechString(targetItem.word);
  const targetPinyinClean = cleanSpeechString(targetItem.phonetic);
  
  let spokenPinyin = isZh ? convertToPinyin(spokenText) : spokenText;
  let spokenPinyinClean = cleanSpeechString(spokenPinyin);

  let score = 0;
  let isPerfect = false;

  // 1. Khớp hoàn toàn chữ Hán hoặc từ mục tiêu
  if (spokenClean === targetClean || spokenText.includes(targetItem.word) || targetItem.word.includes(spokenText)) {
    score = 100;
    isPerfect = true;
  }
  // 2. Khớp Pinyin
  else if (spokenPinyinClean === targetPinyinClean && targetPinyinClean.length > 0) {
    if (spokenPinyin.toLowerCase() === (targetItem.phonetic || '').toLowerCase()) {
      score = 100;
      isPerfect = true;
    } else {
      score = 88; // Đúng âm nhưng thanh điệu hơi lệch
    }
  }
  // 3. Khớp một phần
  else if (spokenClean.length > 0 && (targetClean.includes(spokenClean) || spokenClean.includes(targetClean))) {
    score = 75;
  }
  else if (spokenPinyinClean.length > 0 && (targetPinyinClean.includes(spokenPinyinClean) || spokenPinyinClean.includes(targetPinyinClean))) {
    score = 70;
  }
  else {
    // So sánh độ tương đồng
    let matches = 0;
    const len = Math.max(targetPinyinClean.length, spokenPinyinClean.length);
    for (let i = 0; i < Math.min(targetPinyinClean.length, spokenPinyinClean.length); i++) {
      if (targetPinyinClean[i] === spokenPinyinClean[i]) matches++;
    }
    score = len > 0 ? Math.round((matches / len) * 60) : 30;
  }

  return {
    score: Math.max(25, Math.min(score, 100)),
    isPerfect,
    spokenPinyin,
    spokenHanzi: spokenText
  };
}

function togglePronounceRecording() {
  if (isPronounceRecording) {
    stopPronounceRecording();
  } else {
    startPronounceRecording();
  }
}

function startPronounceRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('pronounceStatusText');
  const micBtn = document.getElementById('btnPronounceMic');

  if (!SpeechRecognition) {
    alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Vui lòng mở bằng Google Chrome hoặc Microsoft Edge!');
    return;
  }

  if (!filteredWords || filteredWords.length === 0) {
    alert('Không có từ vựng nào để luyện. Vui lòng thêm từ hoặc chọn bộ từ khác!');
    return;
  }

  try {
    pronounceRecognition = new SpeechRecognition();
    pronounceRecognition.lang = (currentLang === 'zh') ? 'zh-CN' : 'en-US';
    pronounceRecognition.continuous = false;
    pronounceRecognition.interimResults = false;

    pronounceRecognition.onstart = () => {
      isPronounceRecording = true;
      if (micBtn) micBtn.classList.add('btn-recording');
      if (statusEl) {
        statusEl.textContent = '🔴 Đang lắng nghe... Hãy đọc to từ trên màn hình!';
        statusEl.className = 'text-xs font-bold text-red-600 mt-2 animate-pulse';
      }
    };

    pronounceRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const targetItem = filteredWords[currentPronounceIndex];
      const result = gradePronunciationMatch(targetItem, transcript);
      displayPronounceFeedback(result, targetItem);
    };

    pronounceRecognition.onerror = (event) => {
      console.warn('Pronounce recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Vui lòng cấp quyền sử dụng Micro cho trình duyệt để luyện phát âm!');
      }
      stopPronounceRecording();
    };

    pronounceRecognition.onend = () => {
      stopPronounceRecording();
    };

    pronounceRecognition.start();
  } catch (err) {
    console.error('Recognition start error:', err);
    stopPronounceRecording();
  }
}

function stopPronounceRecording() {
  isPronounceRecording = false;
  const micBtn = document.getElementById('btnPronounceMic');
  const statusEl = document.getElementById('pronounceStatusText');

  if (micBtn) micBtn.classList.remove('btn-recording');
  if (statusEl && !statusEl.textContent.includes('chuẩn') && !statusEl.textContent.includes('chưa') && !statusEl.textContent.includes('Chưa')) {
    statusEl.textContent = 'Chạm vào Micro để bắt đầu nói';
    statusEl.className = 'text-xs font-semibold text-slate-400 mt-2';
  }

  if (pronounceRecognition) {
    try {
      pronounceRecognition.abort();
    } catch (e) {}
    pronounceRecognition = null;
  }
}

function displayPronounceFeedback(result, targetItem) {
  const box = document.getElementById('pronounceFeedbackBox');
  const badge = document.getElementById('pronounceScoreBadge');
  const num = document.getElementById('pronounceScoreNum');
  const spokenHanziEl = document.getElementById('pronounceSpokenHanzi');
  const spokenPinyinEl = document.getElementById('pronounceSpokenPinyin');
  const tipText = document.getElementById('pronounceTipText');
  const statusEl = document.getElementById('pronounceStatusText');

  if (!box) return;
  box.classList.remove('hidden');

  if (spokenHanziEl) spokenHanziEl.textContent = result.spokenHanzi;
  if (spokenPinyinEl) spokenPinyinEl.textContent = result.spokenPinyin;

  if (result.score >= 85) {
    box.className = "p-4 rounded-2xl border text-left space-y-2 bg-emerald-50/80 border-emerald-200 transition-all";
    badge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300";
    badge.textContent = "🎉 Phát âm rất chuẩn!";
    num.className = "text-sm font-black text-emerald-700";
    num.textContent = `${result.score} / 100 điểm`;
    tipText.textContent = "Rất xuất sắc! Âm điệu và thanh chuẩn xác. Hãy bấm 'Sau ▶' để tiếp tục!";
    if (statusEl) {
      statusEl.textContent = "✅ Đọc chuẩn xác!";
      statusEl.className = "text-xs font-bold text-emerald-600 mt-2";
    }
  } else if (result.score >= 60) {
    box.className = "p-4 rounded-2xl border text-left space-y-2 bg-amber-50/80 border-amber-200 transition-all";
    badge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300";
    badge.textContent = "⚠️ Gần đúng rồi!";
    num.className = "text-sm font-black text-amber-700";
    num.textContent = `${result.score} / 100 điểm`;
    tipText.textContent = `Bạn vừa phát âm là "${result.spokenPinyin}". Hãy bấm nút "Nghe giọng mẫu" để nghe lại và thử đọc lại lần nữa nhé!`;
    if (statusEl) {
      statusEl.textContent = "Cần chỉnh lại một chút!";
      statusEl.className = "text-xs font-bold text-amber-600 mt-2";
    }
  } else {
    box.className = "p-4 rounded-2xl border text-left space-y-2 bg-rose-50/80 border-rose-200 transition-all";
    badge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300";
    badge.textContent = "❌ Chưa chính xác";
    num.className = "text-sm font-black text-rose-700";
    num.textContent = `${result.score} / 100 điểm`;
    tipText.textContent = `Máy nghe được là "${result.spokenHanzi}" (${result.spokenPinyin}). Hãy kiểm tra khẩu hình miệng hoặc nói dứt khoát hơn!`;
    if (statusEl) {
      statusEl.textContent = "Hãy thử nói lại!";
      statusEl.className = "text-xs font-bold text-rose-600 mt-2";
    }
  }
}

// ==================== NÓI TỰ DO (FREE SPEECH TO PINYIN) ====================
function toggleFreeSpeechRecording() {
  if (isFreeRecording) {
    stopFreeRecording();
  } else {
    startFreeRecording();
  }
}

function startFreeRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('freeStatusText');
  const micBtn = document.getElementById('btnFreeMic');

  if (!SpeechRecognition) {
    alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Vui lòng mở bằng Google Chrome hoặc Microsoft Edge!');
    return;
  }

  try {
    freeRecognition = new SpeechRecognition();
    freeRecognition.lang = (currentLang === 'zh') ? 'zh-CN' : 'en-US';
    freeRecognition.continuous = true;
    freeRecognition.interimResults = true;

    freeRecognition.onstart = () => {
      isFreeRecording = true;
      if (micBtn) micBtn.classList.add('btn-recording');
      if (statusEl) {
        statusEl.textContent = '🔴 Đang lắng nghe... Nói bất kỳ câu nào vào mic!';
        statusEl.className = 'text-xs font-bold text-red-600 mt-2 animate-pulse';
      }
    };

    freeRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim().length > 0) {
        const hanziEl = document.getElementById('freeHanziDisplay');
        const pinyinEl = document.getElementById('freePinyinDisplay');
        const actionRow = document.getElementById('freeActionRow');

        if (hanziEl) hanziEl.textContent = transcript;
        if (pinyinEl) {
          pinyinEl.textContent = (currentLang === 'zh') ? convertToPinyin(transcript) : transcript;
        }
        if (actionRow) actionRow.classList.remove('hidden');
      }
    };

    freeRecognition.onerror = (event) => {
      console.warn('Free recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Vui lòng cấp quyền sử dụng Micro cho trình duyệt!');
      }
      stopFreeRecording();
    };

    freeRecognition.onend = () => {
      if (isFreeRecording) {
        try { freeRecognition.start(); } catch(e) {}
      } else {
        stopFreeRecording();
      }
    };

    freeRecognition.start();
  } catch (err) {
    console.error('Free recognition error:', err);
    stopFreeRecording();
  }
}

function stopFreeRecording() {
  isFreeRecording = false;
  const micBtn = document.getElementById('btnFreeMic');
  const statusEl = document.getElementById('freeStatusText');

  if (micBtn) micBtn.classList.remove('btn-recording');
  if (statusEl) {
    statusEl.textContent = 'Đã dừng. Bấm Micro để nói lại';
    statusEl.className = 'text-xs font-semibold text-slate-400 mt-2';
  }

  if (freeRecognition) {
    try {
      freeRecognition.stop();
    } catch (e) {}
    freeRecognition = null;
  }
}

function speakFreeSpokenText() {
  const hanziEl = document.getElementById('freeHanziDisplay');
  if (!hanziEl || !hanziEl.textContent || hanziEl.textContent === '拼音') return;
  playAudioVoice(hanziEl.textContent, currentLang, 0.9);
}

function clearFreeSpeech() {
  const hanziEl = document.getElementById('freeHanziDisplay');
  const pinyinEl = document.getElementById('freePinyinDisplay');
  const actionRow = document.getElementById('freeActionRow');

  if (hanziEl) hanziEl.textContent = '拼音';
  if (pinyinEl) pinyinEl.textContent = 'pīn yīn';
  if (actionRow) actionRow.classList.add('hidden');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initData();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
