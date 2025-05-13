import React, { useEffect, useRef, useState } from "react";
import { Category } from "../../types";
import { PlusCircle, Trash2, Loader2, Volume2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Button from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

interface CategoryCardProps {
  category: Category;
  onAddPhrase: (categoryId: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onDeletePhrase?: (phraseId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onAddPhrase,
  onDeleteCategory,
  onDeletePhrase,
}) => {
  const { targetLanguage, isTranslating, translateAllPhrases, translateText } =
    useLanguage();
  const Icon = (LucideIcons as any)[category.icon];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category.phrases.length > 0) {
      translateAllPhrases(category.phrases);
    }
  }, [targetLanguage, category.phrases, translateAllPhrases]);

  useEffect(() => {
    const translatePhrases = async () => {
      const newTranslations: Record<string, string> = {};
      for (const phrase of category.phrases) {
        try {
          const translated = await translateText(phrase.text);
          newTranslations[phrase.id] = translated;
        } catch (error) {
          console.error("Translation error:", error);
          newTranslations[phrase.id] = phrase.text;
        }
      }
      setTranslations(newTranslations);
    };

    if (!isTranslating) {
      translatePhrases();
    }
  }, [category.phrases, targetLanguage, isTranslating, translateText]);

  const handleDeleteCategory = () => {
    if (onDeleteCategory) {
      onDeleteCategory(category.id);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text) return;

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        console.error("Groq API key not found");
        return;
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/audio/speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "playai-tts",
            voice: "Fritz-PlayAI",
            input: text,
            response_format: "wav",
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to generate speech");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:border-blue-200 transition-colors duration-200">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-blue-500 mr-2" />}
          <h3 className="font-medium text-gray-900">{category.name}</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<PlusCircle className="h-4 w-4" />}
            onClick={() => onAddPhrase(category.id)}
            disabled={isTranslating}
            aria-label={`Add phrase to ${category.name}`}
          >
            Add
          </Button>
          {onDeleteCategory && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleDeleteCategory}
              disabled={isTranslating}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              aria-label={`Delete ${category.name} category`}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {isTranslating && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-500">Translating...</span>
          </div>
        )}

        {category.phrases.length > 0 ? (
          category.phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-600">{phrase.text}</p>
                {translations[phrase.id] && (
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {translations[phrase.id]}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Volume2 className="h-4 w-4" />}
                    onClick={() =>
                      handleSpeak(translations[phrase.id] || phrase.text)
                    }
                    disabled={isTranslating}
                    className="p-1 -ml-1"
                    aria-label="Speak phrase"
                  >
                    Speak
                  </Button>
                </div>
              </div>
              {onDeletePhrase && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => onDeletePhrase(phrase.id)}
                  disabled={isTranslating}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  aria-label="Delete phrase"
                >
                  Delete
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center p-4">
            No phrases yet. Add one to get started.
          </p>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default CategoryCard;
