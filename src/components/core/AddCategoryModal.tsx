import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { useLanguage } from "../../context/LanguageContext";
import * as LucideIcons from "lucide-react";

interface AddCategoryModalProps {
  onClose: () => void;
}

const iconOptions = [
  "Book",
  "Calendar",
  "Camera",
  "Car",
  "Clock",
  "Coffee",
  "Compass",
  "CreditCard",
  "Gift",
  "Heart",
  "Home",
  "Image",
  "Laptop",
  "Mail",
  "Map",
  "Music",
  "Package",
  "Phone",
  "ShoppingBag",
  "Star",
  "Sun",
  "Umbrella",
];

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const { addCategory } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addCategory(name.trim(), selectedIcon);
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
          <h3 className="font-medium text-lg">Add New Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <Input
            id="category-name"
            name="category-name"
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            fullWidth
            autoFocus
            required
            className="mb-4"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose an Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 border rounded-md bg-gray-50">
              {iconOptions.map((icon) => {
                const IconComponent = (LucideIcons as any)[icon];
                return (
                  <button
                    key={icon}
                    type="button"
                    className={`p-2 rounded-md flex items-center justify-center ${
                      selectedIcon === icon
                        ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!name.trim()}>
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
