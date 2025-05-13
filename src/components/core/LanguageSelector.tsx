import React from "react";
import { Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { languages } from "../../data/languages";
import Select from "../ui/Select";

const LanguageSelector: React.FC = () => {
  const { user, setUserLanguage } = useAuth();
  const { targetLanguage, setTargetLanguage } = useLanguage();

  if (!user) return null;

  const handleUserLanguageChange = (value: string) => {
    setUserLanguage(value);
  };

  const handleTargetLanguageChange = (value: string) => {
    setTargetLanguage(value);
  };

  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: `${lang.name} (${lang.nativeName})`,
  }));

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:flex items-center text-sm text-gray-600">
        <Globe className="h-4 w-4 mr-1 text-blue-500" />
        <span>Languages:</span>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          id="user-language"
          name="user-language"
          className="text-sm"
          value={user.userLanguage}
          onChange={handleUserLanguageChange}
          options={languageOptions}
          aria-label="Your language"
        />

        <span className="text-gray-400">→</span>

        <Select
          id="target-language"
          name="target-language"
          className="text-sm"
          value={targetLanguage}
          onChange={handleTargetLanguageChange}
          options={languageOptions}
          aria-label="Target language"
        />
      </div>
    </div>
  );
};

export default LanguageSelector;
