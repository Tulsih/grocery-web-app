document.addEventListener("DOMContentLoaded", () => {
  // Add to Cart functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const productId = this.dataset.productId;
      const originalText = this.textContent;

      try {
        this.textContent = "Adding...";
        this.disabled = true;

        const response = await fetch("/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        const data = await response.json();

        if (data.success) {
          this.textContent = "✓ Added!";

          // Update cart badge
          const cartBadge = document.getElementById("cartBadge");
          if (cartBadge) {
            cartBadge.textContent = data.cartItemCount;
          }

          setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
          }, 1500);
        } else {
          alert("Error adding to cart");
          this.textContent = originalText;
          this.disabled = false;
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error adding to cart");
        this.textContent = originalText;
        this.disabled = false;
      }
    });
  });

  // Quantity update functionality
  const decreaseButtons = document.querySelectorAll(".qty-btn.decrease");
  const increaseButtons = document.querySelectorAll(".qty-btn.increase");

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () =>
      updateQuantity(button.dataset.itemId, "decrease")
    );
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () =>
      updateQuantity(button.dataset.itemId, "increase")
    );
  });

  async function updateQuantity(itemId, action) {
    try {
      const response = await fetch("/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, action }),
      });

      const data = await response.json();

      if (data.success) {
        // If item was removed (quantity went to 0), reload page
        if (action === "decrease") {
          const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
          const quantitySpan = cartItem.querySelector(".quantity");
          if (parseInt(quantitySpan.textContent) === 1) {
            location.reload();
            return;
          }
        }

        // Update UI
        location.reload(); // Simple reload for consistency
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating quantity");
    }
  }

  // Remove item functionality
  const removeButtons = document.querySelectorAll(".btn-remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      if (!confirm("Remove this item from cart?")) return;

      const itemId = this.dataset.itemId;

      try {
        const response = await fetch("/cart/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        });

        const data = await response.json();

        if (data.success) {
          location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error removing item");
      }
    });
  });

  // Checkout functionality
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert(
        "Checkout functionality would be implemented here with payment integration!"
      );
    });
  }
});
