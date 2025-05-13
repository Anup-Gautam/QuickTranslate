import React from "react";
import { Phrase } from "../../types";
import { Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

interface PhraseItemProps {
  phrase: Phrase;
  onDelete?: (phraseId: string) => void;
  targetLanguage: string;
  isTranslating: boolean;
}

const PhraseItem: React.FC<PhraseItemProps> = ({
  phrase,
  onDelete,
  targetLanguage,
  isTranslating,
}) => {
  const { translateText } = useLanguage();
  const [translatedText, setTranslatedText] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const translatePhrase = async () => {
      if (!phrase.text || isTranslating) return;

      setIsLoading(true);
      try {
        const result = await translateText(phrase.text);
        setTranslatedText(result);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedText(phrase.text);
      } finally {
        setIsLoading(false);
      }
    };

    translatePhrase();
  }, [phrase.text, targetLanguage, isTranslating, translateText]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(phrase.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex-1">
        <p className="text-sm text-gray-600">{phrase.text}</p>
        {translatedText && (
          <p className="text-sm font-medium text-gray-900 mt-1">
            {isLoading ? "Translating..." : translatedText}
          </p>
        )}
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={handleDelete}
          disabled={isTranslating}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          aria-label="Delete phrase"
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default PhraseItem;
