import React from 'react';

function LayerList({ layers, selectedLayer, onRemoveLayer, onSelectLayer }) {
  return (
    <ul className="layer-list">
      {layers.map((layer, index) => (
        <li
          key={index}
          className={`layer-item ${selectedLayer === index ? 'selected' : ''}`}
          onClick={() => onSelectLayer(index)}
        >
          <span>{layer.nm || `图层 ${index + 1}`}</span>
          <div 
            className="delete-icon" 
            onClick={(e) => {
              e.stopPropagation();
              onRemoveLayer(index);
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export default LayerList;