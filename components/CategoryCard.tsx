import React from 'react';

interface Props {
  categoryName: string;
  onDelete: () => void;
}

const CategoryCard: React.FC<Props> = ({ categoryName, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-60 flex items-center justify-between">
      <span className="font-semibold text-gray-700">{categoryName}</span>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Eliminar
      </button>
    </div>
  );
};

export default CategoryCard;
