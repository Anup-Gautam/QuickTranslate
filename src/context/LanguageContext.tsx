import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

interface LanguageContextType {
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  translateText: (text: string, src?: string) => Promise<string>;
  bulkTranslateText: (texts: string[], src?: string) => Promise<string[]>;
  isTranslating: boolean;
  translateAllPhrases: (
    phrases: { id: string; text: string }[]
  ) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Helper function to get storage key for a user
const getStorageKey = (userId: string, targetLanguage: string) =>
  `translations_${userId}_${targetLanguage}`;

// Helper function to load translations from storage
const loadTranslations = (userId: string, targetLanguage: string) => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId, targetLanguage));
    if (stored) {
      const parsed = JSON.parse(stored) as [string, string][];
      return new Map<string, string>(parsed);
    }
    return new Map<string, string>();
  } catch (error) {
    console.error("Error loading translations from storage:", error);
    return new Map<string, string>();
  }
};

// Helper function to save translations to storage
const saveTranslations = (
  userId: string,
  targetLanguage: string,
  translations: Map<string, string>
) => {
  try {
    localStorage.setItem(
      getStorageKey(userId, targetLanguage),
      JSON.stringify(Array.from(translations.entries()))
    );
  } catch (error) {
    console.error("Error saving translations to storage:", error);
  }
};

// Request queue implementation
class TranslationQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;
  private readonly delay = 1000; // 1 second delay between requests

  async add(request: () => Promise<void>) {
    this.queue.push(request);
    if (!this.isProcessing) {
      await this.process();
    }
  }

  private async process() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
          await new Promise((resolve) => setTimeout(resolve, this.delay));
        } catch (error) {
          console.error("Error processing translation request:", error);
        }
      }
    }
    this.isProcessing = false;
  }
}

// Language code mapping
const LANGUAGE_CODES: Record<string, string> = {
  en: "en", // English
  es: "es", // Spanish
  fr: "fr", // French
  de: "de", // German
  it: "it", // Italian
  pt: "pt", // Portuguese
  ru: "ru", // Russian
  ja: "ja", // Japanese
  ko: "ko", // Korean
  zh: "zh-cn", // Chinese (Simplified)
  ar: "ar", // Arabic
  hi: "hi", // Hindi
};

const getValidLanguageCode = (lang: string): string => {
  const code = lang.toLowerCase();
  return LANGUAGE_CODES[code] || code;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [targetLanguage, setTargetLanguage] = useState<string>(
    user?.targetLanguage || "en"
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(
    new Map()
  );
  const translationQueue = useRef(new TranslationQueue());

  // Load translations when user or target language changes
  useEffect(() => {
    if (user?.id) {
      const loadedTranslations = loadTranslations(user.id, targetLanguage);
      setTranslationCache(loadedTranslations);
    }
  }, [user?.id, targetLanguage]);

  // Save translations when they change
  useEffect(() => {
    if (user?.id && translationCache.size > 0) {
      saveTranslations(user.id, targetLanguage, translationCache);
    }
  }, [user?.id, targetLanguage, translationCache]);

  const translateText = useCallback(
    async (text: string, src: string = "auto"): Promise<string> => {
      if (!text) return "";

      const cacheKey = `${text}-${src}-${targetLanguage}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey) || text;
      }

      return new Promise((resolve) => {
        translationQueue.current.add(async () => {
          try {
            const response = await fetch("http://localhost:8000/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text,
                src,
                dest: getValidLanguageCode(targetLanguage),
                user_id: user?.id,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                `Translation failed: ${errorData.detail || response.statusText}`
              );
            }

            const data = await response.json();
            if (!data.translated) {
              throw new Error(
                "Invalid response format from translation service"
              );
            }

            const translated = data.translated;
            setTranslationCache((prev) => {
              const newCache = new Map(prev);
              newCache.set(cacheKey, translated);
              return newCache;
            });
            resolve(translated);
          } catch (error) {
            console.error("Translation error:", error);
            resolve(text);
          }
        });
      });
    },
    [targetLanguage, translationCache, user?.id]
  );

  const bulkTranslateText = useCallback(
    async (texts: string[], src: string = "auto"): Promise<string[]> => {
      if (!texts.length) return [];

      // Filter out texts that are already in cache
      const textsToTranslate = texts.filter((text) => {
        const cacheKey = `${text}-${src}-${targetLanguage}`;
        return !translationCache.has(cacheKey);
      });

      if (!textsToTranslate.length) {
        return texts.map((text) => {
          const cacheKey = `${text}-${src}-${targetLanguage}`;
          return translationCache.get(cacheKey) || text;
        });
      }

      return new Promise((resolve) => {
        translationQueue.current.add(async () => {
          const maxRetries = 3;
          let retryCount = 0;
          let lastError: Error | null = null;

          while (retryCount < maxRetries) {
            try {
              const response = await fetch(
                "http://localhost:8000/bulk_translate",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    texts: textsToTranslate,
                    src,
                    dest: getValidLanguageCode(targetLanguage),
                    user_id: user?.id,
                  }),
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  `Bulk translation failed: ${
                    errorData.detail || response.statusText
                  }`
                );
              }

              const data = await response.json();
              if (!data.translated || !Array.isArray(data.translated)) {
                throw new Error(
                  "Invalid response format from translation service"
                );
              }

              const translatedTexts = data.translated;

              // Update cache with new translations
              setTranslationCache((prev) => {
                const newCache = new Map(prev);
                textsToTranslate.forEach((text, index) => {
                  const cacheKey = `${text}-${src}-${targetLanguage}`;
                  // Only cache successful translations (non-empty strings)
                  if (translatedTexts[index]) {
                    newCache.set(cacheKey, translatedTexts[index]);
                  }
                });
                return newCache;
              });

              // Return all translations, including cached ones
              const results = texts.map((text) => {
                const cacheKey = `${text}-${src}-${targetLanguage}`;
                return translationCache.get(cacheKey) || text;
              });
              resolve(results);
              return;
            } catch (error) {
              lastError = error as Error;
              console.error(
                `Translation attempt ${retryCount + 1} failed:`,
                error
              );
              retryCount++;

              // Add exponential backoff delay
              if (retryCount < maxRetries) {
                await new Promise((resolve) =>
                  setTimeout(resolve, Math.pow(2, retryCount) * 1000)
                );
              }
            }
          }

          // If all retries failed, return original texts
          console.error("All translation attempts failed:", lastError);
          resolve(texts);
        });
      });
    },
    [targetLanguage, translationCache, user?.id]
  );

  const translateAllPhrases = useCallback(
    async (phrases: { id: string; text: string }[]) => {
      if (!phrases.length) return;

      setIsTranslating(true);
      try {
        const texts = phrases.map((p) => p.text);
        await bulkTranslateText(texts);
      } catch (error) {
        console.error("Error translating all phrases:", error);
      } finally {
        setIsTranslating(false);
      }
    },
    [bulkTranslateText]
  );

  // Update target language when user changes it
  useEffect(() => {
    if (user?.targetLanguage) {
      setTargetLanguage(user.targetLanguage);
    }
  }, [user?.targetLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        targetLanguage,
        setTargetLanguage,
        translateText,
        bulkTranslateText,
        isTranslating,
        translateAllPhrases,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
