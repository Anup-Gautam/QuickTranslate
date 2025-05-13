import React, { useState, useRef } from "react";
import { Send, Volume2, RotateCcw } from "lucide-react";
import Button from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const TranslatorInput: React.FC = () => {
  const [input, setInput] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { translateText } = useLanguage();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const result = await translateText(input.trim());
      setTranslatedText(result);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText(input); // Fallback to original text on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setTranslatedText("");
  };

  const handleSpeak = async () => {
    if (!translatedText) return;

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
            input: translatedText,
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
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h2 className="text-lg font-medium mb-3">Real-time Translator</h2>

      <div className="space-y-4">
        <div>
          <div className="flex">
            <textarea
              id="translation-input"
              name="translation-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type something to translate..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-between mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={handleReset}
              disabled={!input && !translatedText}
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<Send className="h-4 w-4" />}
              onClick={handleTranslate}
              isLoading={isLoading}
              disabled={!input.trim()}
            >
              Translate
            </Button>
          </div>
        </div>

        {translatedText && (
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 mb-1">Translation:</p>
              <Button
                variant="ghost"
                size="sm"
                icon={<Volume2 className="h-4 w-4" />}
                onClick={handleSpeak}
                className="p-1 -mt-1 -mr-1"
                aria-label="Speak translation"
              >
                Speak
              </Button>
            </div>
            <p className="font-medium">{translatedText}</p>
          </div>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default TranslatorInput;
