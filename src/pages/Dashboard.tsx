import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Header from "../components/core/Header";
import CategoryCard from "../components/core/CategoryCard";
import TranslatorInput from "../components/core/TranslatorInput";
import Button from "../components/ui/Button";
import AddPhraseModal from "../components/core/AddPhraseModal";
import AddCategoryModal from "../components/core/AddCategoryModal";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Category } from "../types";
import { defaultCategories } from "../data/defaultCategories";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isTranslating } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Initialize categories from default categories
  useEffect(() => {
    setCategories(defaultCategories);
  }, []);

  const handleAddPhrase = (categoryId: string) => {
    setActiveCategoryId(categoryId);
  };

  const closeAddPhraseModal = () => {
    setActiveCategoryId(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleDeletePhrase = (phraseId: string) => {
    setCategories(
      categories.map((category) => ({
        ...category,
        phrases: category.phrases.filter((phrase) => phrase.id !== phraseId),
      }))
    );
  };

  if (!user) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quick Chats</h1>
          <Button
            variant="primary"
            icon={<PlusCircle className="h-5 w-5" />}
            onClick={() => setShowAddCategoryModal(true)}
          >
            New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <TranslatorInput />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories &&
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onAddPhrase={handleAddPhrase}
                onDeleteCategory={handleDeleteCategory}
                onDeletePhrase={handleDeletePhrase}
              />
            ))}
        </div>
      </main>

      {activeCategoryId && (
        <AddPhraseModal
          categoryId={activeCategoryId}
          onClose={closeAddPhraseModal}
        />
      )}

      {showAddCategoryModal && (
        <AddCategoryModal onClose={() => setShowAddCategoryModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
