import React from 'react';

function SortingFilteringComponent({ onSortChange, onFilterTextChange, onFilterTypeChange, filterText, selectedSort, selectedFilterType }) {
  
  return (
    <div>
      <div>
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" value={selectedSort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">No Sorting</option>
          <option value="mostLikes">Most Likes</option>
          <option value="leastLikes">Least Likes</option>
          <option value="newest">Latest Creation Date</option>
          <option value="oldest">Oldest Creation Date</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-type">Filter by:</label>
        <select id="filter-type" value={selectedFilterType} onChange={(e) => onFilterTypeChange(e.target.value)}>
          <option value="">No Filter</option>
          <option value="description">Description</option>
          <option value="title">Title</option>
          <option value="likes">Number of Likes</option>
          <option value="dislikes">Number of Dislikes</option>
          <option value="fileFormat">File forrmat</option>
        </select>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Enter filter text"
          style={{ width: '90px' }}
        />
      </div>
    </div>
  );
}

export default SortingFilteringComponent;
