// MyMemory Translation API (무료, 하지만 제한 있음)

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
}

// MyMemory Translation API
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string, targetLang: string = 'ko'): Promise<string> {
  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    // 간단한 번역을 위해 처음 500자만 번역
    const textToTranslate = text.substring(0, 500);

    console.log(`🌐 Translating: "${textToTranslate.substring(0, 50)}..."`);

    const url = `${MYMEMORY_API_URL}?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.status}`);
      return text;
    }

    const data: TranslationResponse = await response.json();

    if (!data.responseData?.translatedText) {
      console.warn('No translation found');
      return text;
    }

    console.log(`✅ Translated: "${data.responseData.translatedText.substring(0, 50)}..."`);
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // 번역 실패 시 원본 텍스트 반환
    return text;
  }
}

// 헤드라인 번역
export async function translateHeadline(text: string): Promise<string> {
  return await translateText(text, 'ko');
}
