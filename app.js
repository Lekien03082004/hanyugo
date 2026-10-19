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
  checkServerStatus();
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

  renderCurrentCharacter();
  renderHomeDrill();
  renderFlashcard();
  renderVocabList();
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
  currentTab = tabId;
  const tabs = ['writing', 'home', 'flashcard', 'vocab', 'settings'];
  const navIds = {
    writing: 'navWriting',
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
  if (now - lastAudioTapTimestamp < 300) return;
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
  const targetLang = isZh ? 'zh-CN' : 'en-US';

  // 1. NẾU ĐANG CHẠY TRÊN MÁY TÍNH CÓ PYTHON SERVER: Dùng endpoint /tts
  if (isLocalPythonServerHost() && isServerOnline) {
    const ttsUrl = `/tts?text=${encodeURIComponent(clean)}&lang=${isZh ? 'zh' : 'en'}`;
    const player = new Audio();
    currentActiveAudioInstance = player;
    player.playbackRate = rate;
    player.src = ttsUrl;
    player.onerror = () => {
      isServerOnline = false;
      speakWithNativeTTS(clean, lang, rate);
    };
    player.play().catch(() => {
      speakWithNativeTTS(clean, lang, rate);
    });
    return;
  }

  // 2. NẾU ĐANG CHẠY TRÊN GITHUB PAGES / ĐIỆN THOẠI (ONLINE):
  // Thử phát âm thanh chuẩn Bắc Kinh qua stream Google TTS (chất lượng studio phát thanh)
  if (navigator.onLine) {
    const onlineUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=${targetLang}&client=tw-ob`;
    const player = new Audio();
    currentActiveAudioInstance = player;
    player.playbackRate = rate;

    let hasAudioStarted = false;
    // Cứu nguy: nếu mạng lag sau 650ms chưa kêu -> chuyển ngay sang giọng offline Bắc Kinh của máy
    const fallbackTimer = setTimeout(() => {
      if (!hasAudioStarted) {
        speakWithNativeTTS(clean, lang, rate);
      }
    }, 650);

    player.onplay = () => {
      hasAudioStarted = true;
      clearTimeout(fallbackTimer);
    };

    player.onerror = () => {
      clearTimeout(fallbackTimer);
      speakWithNativeTTS(clean, lang, rate);
    };

    player.src = onlineUrl;
    player.play().catch(() => {
      clearTimeout(fallbackTimer);
      speakWithNativeTTS(clean, lang, rate);
    });
    return;
  }

  // 3. NẾU OFFLINE HOÀN TOÀN (TẮT MẠNG / TẮT MÁY TÍNH):
  // Dùng trực tiếp bộ máy giọng đọc chuẩn Bắc Kinh offline của điện thoại
  speakWithNativeTTS(clean, lang, rate);
}

function speakCurrentWord() {
  if (filteredWords.length === 0) return;
  playAudioVoice(filteredWords[currentCharIndex].word, currentLang, currentPlaybackSpeed);
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

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initData();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
