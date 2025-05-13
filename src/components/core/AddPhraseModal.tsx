import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

interface AddPhraseModalProps {
  categoryId: string;
  onClose: () => void;
}

const AddPhraseModal: React.FC<AddPhraseModalProps> = ({
  categoryId,
  onClose,
}) => {
  const [phrase, setPhrase] = useState("");
  const { addPhrase, isTranslating } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim()) {
      await addPhrase(categoryId, phrase.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-lg">Add New Phrase</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <Input
            id="phrase-input"
            name="phrase-input"
            label="Enter phrase in English"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Type your phrase here..."
            fullWidth
            autoFocus
            required
          />

          <div className="mt-4 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isTranslating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isTranslating}
              disabled={!phrase.trim()}
            >
              Add & Translate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhraseModal;
