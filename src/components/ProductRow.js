import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./ProductRow.css";

const ProductRow = ({
  product,
  index,
  onEdit,
  onAddDiscount,
  onRemove,
  onRemoveVariant,
  onToggleExpand,
  isExpanded,
}) => {
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [discountType, setDiscountType] = useState("flat");
  const [discountValue, setDiscountValue] = useState("");

  const handleAddDiscount = () => {
    onAddDiscount(discountType, discountValue);
    setIsAddingDiscount(false);
  };

  return (
    <div className="product-row-container">
      {/* Main Product Row */}
      <div className="product-row">
        <div className="product-details">
          <DragIndicatorIcon className="drag-icon" />
          <span className="product-index">{index + 1}</span>
          <div className="product-info">
            <span className="product-name">
              {product.name || "Select Product"}
              <button className="edit-button" onClick={onEdit}>
                <EditIcon />
              </button>
            </span>
          </div>
        </div>

        {/* Add Discount Section */}
        {isAddingDiscount ? (
          <div className="discount-section">
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Discount"
            />
            <button
              className="add-discount-confirm"
              onClick={handleAddDiscount}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="add-discount-button">
            <button
              className="add-discount-button-green"
              onClick={() => setIsAddingDiscount(true)}
            >
              Add Discount
            </button>
            {/* Variants Expand/Collapse */}
            <div
              className={`expand-toggle ${
                product.variants?.length === 0 ? "disabled" : ""
              }`}
              onClick={
                product.variants?.length > 0 ? onToggleExpand : undefined
              }
            >
              {isExpanded ? "↑ Hide Variants" : "↓ Show Variants"}
            </div>
          </div>
        )}

        {/* Product Remove Button */}
        {onRemove && (
          <button className="remove-button" onClick={() => onRemove(index)}>
            x
          </button>
        )}
      </div>
      {/* Variants Display */}
      {isExpanded &&
        product.variants.map((variant, variantIndex) => (
          <div key={variant.id} className="variant-row">
            <div className="product-row">
              <div className="product-details">
                <DragIndicatorIcon className="drag-icon" />
                <div className="product-info">
                  <span className="product-name">
                    {variant.title}
                    <button
                      className="edit-button"
                      onClick={() => onEdit(variant.id)}
                    ></button>
                  </span>
                </div>
              </div>
              <div className="variant-info">
                <span className="variant-price">${variant.price}</span>
              </div>
              {isAddingDiscount && (
                <div className="discount-section">
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="Discount"
                  />
                </div>
              )}
            </div>

            {onRemoveVariant && (
              <button
                className="remove-button"
                onClick={() => {
                  onRemoveVariant(index, variantIndex);
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default ProductRow;
