require('dotenv').config();
const m = require('masto');

const masto = m.createRestAPIClient({
	url: 'https://networked-media.itp.io',
	accessToken: process.env.TOKEN,
});

const POST_VISIBILITY = 'public';
const MIN_POST_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
// const MIN_POST_INTERVAL_MS = 10 * 1000; // DEBUG: 10 seconds
const MAX_POSTS_PER_DAY = 50;
const CORE_SENTENCE = 'Everything does not need to be solved tonight. Sleep.';

// Configurable language list: remove any language name here to disable it.
const SUPPORTED_LANGUAGES = [
	'English', 'Spanish', 'French', 'Chinese', 'Japanese', 'Korean', 'German', 'Italian',
	'Portuguese', 'Arabic', 'Hindi', 'Russian', 'Turkish', 'Dutch', 'Greek', 'Swedish',
	'Thai', 'Vietnamese', 'Indonesian', 'Polish', 'Czech', 'Romanian', 'Hungarian', 'Finnish',
	'Norwegian', 'Danish', 'Ukrainian', 'Hebrew', 'Malay', 'Filipino (Tagalog)', 'Swahili',
	'Bengali', 'Punjabi', 'Tamil', 'Telugu', 'Urdu', 'Persian (Farsi)', 'Catalan', 'Croatian',
	'Slovak', 'Bulgarian', 'Serbian', 'Lithuanian', 'Latvian', 'Estonian', 'Slovenian',
	'Afrikaans', 'Welsh', 'Irish (Gaelic)',
];

const TRANSLATIONS = [
	{ language: 'English', text: 'Everything does not need to be solved tonight. Sleep.', hashtag: '#sleep' },
	{ language: 'Spanish', text: 'No todo tiene que resolverse esta noche. Duerme.', hashtag: '#duerme' },
	{ language: 'French', text: "Tout n'a pas besoin d'être résolu ce soir. Dors.", hashtag: '#dors' },
	{ language: 'Chinese', text: '并不是今晚所有事情都需要解决。睡吧。', hashtag: '#睡眠' },
	{ language: 'Japanese', text: '今夜すべてを解決する必要はありません。眠ってください。', hashtag: '#眠り' },
	{ language: 'Korean', text: '모든 것을 오늘 밤 해결할 필요는 없습니다. 자요.', hashtag: '#수면' },
	{ language: 'German', text: 'Nicht alles muss heute Nacht gelöst werden. Schlaf.', hashtag: '#schlaf' },
	{ language: 'Italian', text: 'Non tutto deve essere risolto stanotte. Dormi.', hashtag: '#dormi' },
	{ language: 'Portuguese', text: 'Nem tudo precisa ser resolvido esta noite. Durma.', hashtag: '#durma' },
	{ language: 'Arabic', text: 'ليس كل شيء يحتاج إلى حل الليلة. نَم.', hashtag: '#نوم' },
	{ language: 'Hindi', text: 'आज रात सब कुछ हल करने की ज़रूरत नहीं है। सो जाओ।', hashtag: '#नींद' },
	{ language: 'Russian', text: 'Не всё нужно решать сегодня ночью. Спи.', hashtag: '#сон' },
	{ language: 'Turkish', text: 'Her şeyin bu gece çözülmesi gerekmiyor. Uyu.', hashtag: '#uyu' },
	{ language: 'Dutch', text: 'Niet alles hoeft vanavond opgelost te worden. Slaap.', hashtag: '#slaap' },
	{ language: 'Greek', text: 'Δεν χρειάζεται να λυθούν όλα απόψε. Κοιμήσου.', hashtag: '#ύπνος' },
	{ language: 'Swedish', text: 'Allt behöver inte lösas ikväll. Sov.', hashtag: '#sov' },
	{ language: 'Thai', text: 'ไม่จำเป็นต้องแก้ทุกอย่างคืนนี้ นอนหลับได้เลย', hashtag: '#นอนหลับ' },
	{ language: 'Vietnamese', text: 'Không phải mọi thứ đều cần được giải quyết tối nay. Ngủ đi.', hashtag: '#ngủ' },
	{ language: 'Indonesian', text: 'Tidak semua hal perlu diselesaikan malam ini. Tidurlah.', hashtag: '#tidur' },
	{ language: 'Polish', text: 'Nie wszystko musi zostać rozwiązane dziś wieczorem. Śpij.', hashtag: '#sen' },
	{ language: 'Czech', text: 'Ne všechno musí být dnes večer vyřešeno. Spi.', hashtag: '#spánek' },
	{ language: 'Romanian', text: 'Nu totul trebuie rezolvat în seara asta. Dormi.', hashtag: '#somn' },
	{ language: 'Hungarian', text: 'Nem kell mindent ma este megoldani. Aludj.', hashtag: '#alvás' },
	{ language: 'Finnish', text: 'Kaikkea ei tarvitse ratkaista tänä iltana. Nuku.', hashtag: '#uni' },
	{ language: 'Norwegian', text: 'Ikke alt må løses i kveld. Sov.', hashtag: '#søvn' },
	{ language: 'Danish', text: 'Ikke alt skal løses i aften. Sov.', hashtag: '#søvn' },
	{ language: 'Ukrainian', text: 'Не все потрібно вирішувати сьогодні ввечері. Спи.', hashtag: '#сон' },
	{ language: 'Hebrew', text: 'לא הכל צריך להיפתר הלילה. שְׁנָה.', hashtag: '#שינה' },
	{ language: 'Malay', text: 'Tidak semua perkara perlu diselesaikan malam ini. Tidur.', hashtag: '#tidur' },
	{ language: 'Filipino (Tagalog)', text: 'Hindi kailangang malutas ang lahat ngayong gabi. Matulog.', hashtag: '#tulog' },
	{ language: 'Swahili', text: 'Sio kila kitu kinahitaji kutatuliwa usiku huu. Lala.', hashtag: '#kulala' },
	{ language: 'Bengali', text: 'আজ রাতে সব কিছু সমাধান করার দরকার নেই। ঘুমাও।', hashtag: '#ঘুম' },
	{ language: 'Punjabi', text: 'ਸਭ ਕੁਝ ਅੱਜ ਰਾਤ ਨੂੰ ਸੁਲਝਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ। ਸੌ ਜਾ।', hashtag: '#ਨੀਂਦ' },
	{ language: 'Tamil', text: 'இன்று இரவு எல்லாம் தீர்க்க வேண்டியதில்லை. தூங்கு.', hashtag: '#தூக்கம்' },
	{ language: 'Telugu', text: 'ఈ రాత్రి అన్నీ పరిష్కరించాల్సిన అవసరం లేదు. నిద్రపో.', hashtag: '#నిద్ర' },
	{ language: 'Urdu', text: 'آج رات سب کچھ حل کرنے کی ضرورت نہیں ہے۔ سو جاؤ۔', hashtag: '#نیند' },
	{ language: 'Persian (Farsi)', text: 'همه چیز لازم نیست امشب حل شود. بخواب.', hashtag: '#خواب' },
	{ language: 'Catalan', text: "No tot s'ha de resoldre aquesta nit. Dorm.", hashtag: '#son' },
	{ language: 'Croatian', text: 'Ne mora se sve riješiti večeras. Spavaj.', hashtag: '#san' },
	{ language: 'Slovak', text: 'Všetko nemusí byť dnes večer vyriešené. Spi.', hashtag: '#spánok' },
	{ language: 'Bulgarian', text: 'Не всичко трябва да се реши тази вечер. Спи.', hashtag: '#сън' },
	{ language: 'Serbian', text: 'Не све мора да се реши вечерас. Спавај.', hashtag: '#сан' },
	{ language: 'Lithuanian', text: 'Ne viskas turi būti išspręsta šį vakarą. Miegok.', hashtag: '#miegas' },
	{ language: 'Latvian', text: 'Ne viss jāatrisina šovakar. Guļ.', hashtag: '#miegs' },
	{ language: 'Estonian', text: 'Kõike ei pea täna õhtul lahendama. Maga.', hashtag: '#uni' },
	{ language: 'Slovenian', text: 'Ni treba, da se vse reši nocoj. Spi.', hashtag: '#spanje' },
	{ language: 'Afrikaans', text: 'Nie alles hoef vanaand opgelos te word nie. Slaap.', hashtag: '#slaap' },
	{ language: 'Welsh', text: 'Nid oes angen dat popeth yn cael ei ddatrys heno. Cysga.', hashtag: '#cysgu' },
	{ language: 'Irish (Gaelic)', text: 'Ní gá gach rud a réiteach anocht. Codladh.', hashtag: '#codladh' },
];

const NSFW_BLOCKLIST = ['nsfw', 'explicit', 'sexual', 'nude', 'nudity', 'porn', 'xxx', 'fetish'];
const FORBIDDEN_FIRST_PERSON_PATTERNS = [/\bi\b/i, /\bme\b/i, /\bmy\b/i, /\bmine\b/i, /\bi'm\b/i, /\bi've\b/i, /\bi’d\b/i, /\bi’ve\b/i];

const state = {
	lastPostedAt: null,
	dayKey: new Date().toISOString().slice(0, 10),
	dailyCount: 0,
	lastLanguage: null,
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const enabledTranslations = TRANSLATIONS.filter((item) => SUPPORTED_LANGUAGES.includes(item.language));
const ALLOWED_POSTS = new Set(enabledTranslations.map((item) => `${item.text} ${item.hashtag}`));
let languageQueue = shuffle(enabledTranslations);
let languageIndex = 0;

const containsNsfw = (text) => {
	const lowered = text.toLowerCase();
	return NSFW_BLOCKLIST.some((term) => lowered.includes(term));
};

const validatePost = (entry, text) => {
	// Strict allowlist check keeps content locked to exact translations only.
	if (!ALLOWED_POSTS.has(text)) return false;
	if (!text.endsWith(` ${entry.hashtag}`)) return false;
	if (entry.language === 'English' && !text.startsWith(CORE_SENTENCE)) return false;
	if (containsNsfw(text)) return false;
	if (FORBIDDEN_FIRST_PERSON_PATTERNS.some((pattern) => pattern.test(text))) return false;
	return true;
};

const refreshDay = () => {
	const today = new Date().toISOString().slice(0, 10);
	if (today !== state.dayKey) {
		state.dayKey = today;
		state.dailyCount = 0;
	}
};

const nextTranslation = () => {
	if (enabledTranslations.length === 0) return null;

	if (languageIndex >= languageQueue.length) {
		languageQueue = shuffle(enabledTranslations);
		languageIndex = 0;
	}

	// Rotate language and avoid immediate repeats when possible.
	for (let i = 0; i < languageQueue.length; i += 1) {
		const entry = languageQueue[languageIndex];
		languageIndex += 1;
		if (entry.language !== state.lastLanguage || languageQueue.length === 1) {
			return entry;
		}
		if (languageIndex >= languageQueue.length) {
			languageQueue = shuffle(enabledTranslations);
			languageIndex = 0;
		}
	}

	return pickRandom(languageQueue);
};

const generateValidPost = () => {
	// If one translation is malformed/missing, skip to next supported language.
	for (let i = 0; i < enabledTranslations.length; i += 1) {
		const entry = nextTranslation();
		if (!entry || !entry.text || !entry.hashtag) continue;
		const candidate = `${entry.text} ${entry.hashtag}`;
		if (validatePost(entry, candidate)) return { language: entry.language, post: candidate };
	}
	return null;
};

const postSoftReset = async () => {
	try {
		refreshDay();
		if (state.dailyCount >= MAX_POSTS_PER_DAY) return;
		if (state.lastPostedAt) {
			const elapsed = Date.now() - new Date(state.lastPostedAt).getTime();
			console.log(`[DEBUG] Elapsed since last post: ${elapsed}ms | Required: ${MIN_POST_INTERVAL_MS - 5000}ms`);
			if (elapsed < MIN_POST_INTERVAL_MS - 5000) {
				console.log(`[DEBUG] Too soon — skipping post.`);
				return;
			}
			console.log(`[DEBUG] Buffer passed — proceeding to post.`);
		}

		const payload = generateValidPost();
		if (!payload) {
			console.warn('No safe post generated this cycle.');
			return;
		}

		const response = await masto.v1.statuses.create({
			status: payload.post,
			visibility: POST_VISIBILITY,
		});
		state.lastPostedAt = new Date().toISOString();
		state.dailyCount += 1;
		state.lastLanguage = payload.language;
		console.log(`[POST] (${payload.language}): ${response.url}`);
		console.log(`[DEBUG] Daily count: ${state.dailyCount} | Last posted at: ${state.lastPostedAt}`);
	} catch (err) {
		console.error('Post attempt failed:', err.message);
	}
};

// Post immediately once, then every 30 minutes.
postSoftReset();
setInterval(postSoftReset, MIN_POST_INTERVAL_MS);
