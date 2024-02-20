import React from 'react';

function SortingFilteringComponent({ onSortChange, onFilterTextChange, onFilterTypeChange, filterType }) {
  return (
    <div>
      <div>
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" onChange={(e) => onSortChange(e.target.value)}>
          <option value="">No Sorting</option>
          <option value="mostLikes">Most Likes</option>
          <option value="leastLikes">Least Likes</option>
          <option value="newest">Latest Creation Date</option>
          <option value="oldest">Oldest Creation Date</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-type">Filter by:</label>
        <select id="filter-type" onChange={(e) => onFilterTypeChange(e.target.value)}>
          <option value="description">Description</option>
          <option value="title">Title</option>
          <option value="likes">Number of Likes</option>
          </select>
        <input
          type="text"
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Enter filter text"
        />
      </div>
    </div>
  );
}

export default SortingFilteringComponent;
