import React from "react";

interface SearchAndSortProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortKey: string;
  setSortKey: (val: any) => void;
  placeholder: string;
  options: string[];
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchTerm,
  setSearchTerm,
  sortKey,
  setSortKey,
  placeholder,
  options,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full md:w-64"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="p-2 border rounded-md"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt === 'groupName'
                ? 'Sort by Group Name'
                : opt === 'leaderName'
                ? 'Sort by Leader Name'
                : 'Sort by Event Name'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchAndSort;