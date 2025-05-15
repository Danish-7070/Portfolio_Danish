import React, { useState } from 'react';

const NewsCard = ({ newsItem, onRemove, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Maximum number of characters before truncating
  const MAX_CHARACTERS = 150;

  // Function to truncate text
  const getTruncatedText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.slice(0, maxLength) + '...' 
      : text;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 relative">
      <h2 className="text-xl font-semibold mb-2">{newsItem.title}</h2>
      
      <p className="text-gray-600 mb-2">
        {isExpanded ? newsItem.content : getTruncatedText(newsItem.content, MAX_CHARACTERS)}
        
        {newsItem.content.length > MAX_CHARACTERS && (
          <button 
            className="text-blue-500 ml-2 hover:underline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        )}
      </p>
      
      {type === "remove" && (
        <button
          className="mt-2 text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
          onClick={() => onRemove(newsItem._id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default NewsCard;