import React, { useState } from "react";
import ProductPicker from "./ProductPicker";
import ProductRow from "./ProductRow";
import "./ProductList.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Select Product", variants: [], expanded: false },
  ]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditProduct = (index) => {
    setEditingIndex(index);
    setPickerOpen(true);
  };

  const handleAddProducts = (selectedProducts) => {
    const updatedProducts = [...products];
    updatedProducts.splice(
      editingIndex,
      1,
      ...selectedProducts.map((p) => ({
        id: p.productId,
        name: `${p.title}`,
        variants: p.variants || [],
        discount: null,
        expanded: false,
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
    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];
    const updatedVariants = product.variants.filter(
      (_, i) => i !== variantIndex
    );

    updatedProducts[productIndex] = {
      ...product,
      variants: updatedVariants,
    };

    setProducts(updatedProducts);
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "product") {
      // Handle product reordering
      const reorderedProducts = Array.from(products);
      const [movedProduct] = reorderedProducts.splice(source.index, 1);
      reorderedProducts.splice(destination.index, 0, movedProduct);

      setProducts(
        reorderedProducts.map((product, index) => ({
          ...product,
          serialNo: index + 1,
        }))
      );
    } else if (type === "variant") {
      // Extract productIndex from droppableId
      const productIndex = parseInt(destination.droppableId.split("-")[2], 10);
      handleDragEndVariants(productIndex, source.index, destination.index);
    }
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
        expanded: false,
      },
    ]);
  };

  const toggleExpandProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].expanded = !updatedProducts[index].expanded;
    setProducts(updatedProducts);
  };

  const handleDragEndVariants = (
    productIndex,
    sourceIndex,
    destinationIndex
  ) => {
    if (destinationIndex == null) return;

    // Create a copy of the products state
    const updatedProducts = [...products];

    // Get the product whose variants are being reordered
    const product = updatedProducts[productIndex];

    // Reorder the variants immutably
    const updatedVariants = Array.from(product.variants);
    const [movedVariant] = updatedVariants.splice(sourceIndex, 1);
    updatedVariants.splice(destinationIndex, 0, movedVariant);

    // Update the product with reordered variants
    updatedProducts[productIndex] = {
      ...product,
      variants: updatedVariants,
    };

    // Update state
    setProducts(updatedProducts);
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Add Products</h1>
      <div className="product-headers">
        <h3>Product</h3>
        <h3>Discount</h3>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-products" type="product">
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
                      <ProductRow
                        product={product}
                        index={index}
                        onEdit={() => handleEditProduct(index)}
                        onAddDiscount={(discountType, discountValue) =>
                          handleAddDiscount(index, discountType, discountValue)
                        }
                        onRemove={() => handleRemoveProduct(index)}
                        onRemoveVariant={(variantIndex) =>
                          handleRemoveVariant(index, variantIndex)
                        }
                        onToggleExpand={() => toggleExpandProduct(index)}
                        isExpanded={product.expanded}
                        onDragEndVariants={(sourceIndex, destinationIndex) =>
                          handleDragEndVariants(
                            index,
                            sourceIndex,
                            destinationIndex
                          )
                        }
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
