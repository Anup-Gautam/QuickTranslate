from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import asyncio
from datetime import datetime
from googletrans import Translator
import logging
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Translation cache structure: {user_id: {lang: {text: translation}}}
translation_cache = defaultdict(lambda: defaultdict(dict))

# Language code mapping
LANGUAGE_CODES = {
    "en": "en",  # English
    "es": "es",  # Spanish
    "fr": "fr",  # French
    "de": "de",  # German
    "it": "it",  # Italian
    "pt": "pt",  # Portuguese
    "ru": "ru",  # Russian
    "ja": "ja",  # Japanese
    "ko": "ko",  # Korean
    "zh": "zh-cn",  # Chinese (Simplified)
    "ar": "ar",  # Arabic
    "hi": "hi",  # Hindi
}

class TranslateRequest(BaseModel):
    text: str
    src: Optional[str] = "auto"
    dest: str
    user_id: Optional[str] = None

class BulkTranslateRequest(BaseModel):
    texts: List[str]
    src: Optional[str] = "auto"
    dest: str
    user_id: Optional[str] = None

def get_valid_language_code(lang: str) -> str:
    """Convert language code to a valid format for googletrans"""
    lang = lang.lower()
    return LANGUAGE_CODES.get(lang, lang)

def get_cached_translation(user_id: str, text: str, dest_lang: str) -> Optional[str]:
    """Get translation from cache if it exists"""
    if user_id in translation_cache:
        user_cache = translation_cache[user_id]
        if dest_lang in user_cache:
            return user_cache[dest_lang].get(text)
    return None

def cache_translation(user_id: str, text: str, dest_lang: str, translation: str):
    """Cache a translation"""
    translation_cache[user_id][dest_lang][text] = translation

async def translate_text(text: str, dest_lang: str, src_lang: str = "auto", user_id: Optional[str] = None) -> str:
    """Translate text using googletrans"""
    try:
        # Check cache first if user_id is provided
        if user_id:
            cached = get_cached_translation(user_id, text, dest_lang)
            if cached is not None:
                logger.info(f"Using cached translation for text: {text}")
                return cached

        dest_lang = get_valid_language_code(dest_lang)
        logger.info(f"Translating text: {text} from {src_lang} to {dest_lang}")
        translator = Translator()
        result = translator.translate(text, dest=dest_lang, src=src_lang)
        
        if not result or not hasattr(result, 'text'):
            logger.error(f"Invalid translation result for text: {text}")
            return text
            
        translated_text = result.text
        if not translated_text:
            logger.warning(f"Empty translation result for text: {text}")
            return text
            
        # Cache the translation if user_id is provided
        if user_id:
            cache_translation(user_id, text, dest_lang, translated_text)
            
        logger.info(f"Translation result: {translated_text}")
        return translated_text
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return text  # Return original text on error

@app.post("/translate")
async def translate(req: TranslateRequest):
    start_time = datetime.now()
    try:
        if not req.text or not req.dest:
            raise HTTPException(status_code=422, detail="Text and destination language are required")
            
        translated_text = await translate_text(req.text, req.dest, req.src, req.user_id)
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"Translation completed in {duration:.2f} seconds")
        return {"translated": translated_text}
    except Exception as e:
        logger.error(f"Translation endpoint error: {str(e)}")
        return {"translated": req.text}

@app.post("/bulk_translate")
async def bulk_translate(req: BulkTranslateRequest):
    start_time = datetime.now()
    try:
        if not req.texts or not req.dest:
            raise HTTPException(status_code=422, detail="Texts and destination language are required")
            
        # Validate input texts
        valid_texts = [text for text in req.texts if text and isinstance(text, str)]
        if not valid_texts:
            raise HTTPException(status_code=422, detail="No valid texts to translate")
            
        dest_lang = get_valid_language_code(req.dest)
        translator = Translator()
        translations = []
        
        # Process translations one by one to ensure reliability
        for text in valid_texts:
            try:
                # Check cache first if user_id is provided
                if req.user_id:
                    cached = get_cached_translation(req.user_id, text, dest_lang)
                    if cached is not None:
                        logger.info(f"Using cached translation for text: {text}")
                        translations.append(cached)
                        continue

                result = translator.translate(text, dest=dest_lang, src=req.src)
                if result and hasattr(result, 'text') and result.text:
                    translated_text = result.text
                    # Cache the translation if user_id is provided
                    if req.user_id:
                        cache_translation(req.user_id, text, dest_lang, translated_text)
                    translations.append(translated_text)
                else:
                    logger.warning(f"Invalid translation result for text: {text}")
                    translations.append(text)  # Use original text if translation fails
                
                # Add a small delay between translations
                await asyncio.sleep(0.2)
            except Exception as e:
                logger.error(f"Error translating text '{text}': {str(e)}")
                translations.append(text)  # Use original text on error
            
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"Bulk translation completed in {duration:.2f} seconds")
        return {"translated": translations, "duration": duration}
    except Exception as e:
        logger.error(f"Bulk translation endpoint error: {str(e)}")
        # Return original texts on error
        return {"translated": req.texts, "duration": 0}