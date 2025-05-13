export interface User {
  id: string;
  email: string;
  username: string;
  userLanguage: string;
  targetLanguage: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  phrases: Phrase[];
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Phrase {
  id: string;
  text: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}
