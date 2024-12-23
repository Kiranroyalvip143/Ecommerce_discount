import React, { useState } from "react";
import ProductPicker from "./ProductPicker";
import ProductRow from "./ProductRow";
import "./ProductList.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Select Product", variants: [] },
  ]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  console.log(products);
  const handleEditProduct = (index) => {
    setEditingIndex(index);
    setPickerOpen(true);
  };

  const handleAddProducts = (selectedProducts) => {
    console.log(`selected product`, selectedProducts);
    const updatedProducts = [...products];
    updatedProducts.splice(
      editingIndex,
      1,
      ...selectedProducts.map((p) => ({
        id: p.productId,
        name: `${p.title}`,
        variants: p.variants || [],
        discount: null,
      }))
    );
    setProducts(updatedProducts);
  };

  const handleAddDiscount = (index, discountType, discountValue) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = {
      type: discountType,
      value: discountValue,
    };
    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleRemoveVariant = (productIndex, variantIndex) => {
    // Ensure that you're correctly accessing the variants of the product
    const updatedProducts = [...products];
    const product = updatedProducts[productIndex]; // Get the specific product
    const updatedVariants = product.variants.filter(
      (_, i) => i !== variantIndex
    ); // Remove the variant by index

    // Update the product's variants
    updatedProducts[productIndex] = {
      ...product,
      variants: updatedVariants, // Set the updated variants
    };

    setProducts(updatedProducts); // Update the products state
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedProducts = Array.from(products);
    const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, movedProduct);
    setProducts(
      reorderedProducts.map((product, index) => ({
        ...product,
        serialNo: index + 1,
      }))
    );
  };

  const handleAddNewProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: `Product ${products.length + 1}`,
        variants: [],
        serialNo: products.length + 1,
        discount: null,
      },
    ]);
  };

  const toggleExpandProduct = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Add Products</h1>
      <div className="product-headers">
        <h3>Product</h3>
        <h3>Discount</h3>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-products">
          {(provided) => (
            <div
              className="products-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {products.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={String(product.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* Product Row */}
                      <ProductRow
                        product={product}
                        index={index}
                        onEdit={() => handleEditProduct(index)}
                        onAddDiscount={(discountType, discountValue) =>
                          handleAddDiscount(index, discountType, discountValue)
                        }
                        onRemove={() => handleRemoveProduct(index)}
                        onRemoveVariant={(index, variantIndex) =>
                          handleRemoveVariant(index, variantIndex)
                        } // Passing variantIndex
                        onToggleExpand={() => toggleExpandProduct(product.id)}
                        isExpanded={expandedProducts[product.id]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        className="add-product-button-green"
        onClick={handleAddNewProduct}
      >
        Add Product
      </button>
      <ProductPicker
        isOpen={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={handleAddProducts}
      />
    </div>
  );
};

export default ProductList;
