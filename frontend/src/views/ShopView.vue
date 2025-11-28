<script setup>
import { ref, computed, onMounted, watch } from "vue";

const shops = ref([]);
const loading = ref(true);
const error = ref(null);

const search = ref("");
const selectedType = ref("All");
const selectedShop = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/shops");
    if (!res.ok) throw new Error("Failed to load shops");
    shops.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// liste des types pour le bouton "Type"
const shopTypes = computed(() => {
  const types = new Set(shops.value.map((s) => s.Type));
  return ["All", ...types];
});

// filtre par recherche + type
const filteredShops = computed(() => {
  const q = search.value.toLowerCase();
  return shops.value.filter((shop) => {
    const matchesSearch =
      shop.ShopName.toLowerCase().includes(q) ||
      shop.Adress.toLowerCase().includes(q);

    const matchesType =
      selectedType.value === "All" || shop.Type === selectedType.value;

    return matchesSearch && matchesType;
  });
});

// shop sélectionné = le premier du filtre, ou celui cliqué
watch(
  filteredShops,
  (list) => {
    if (!selectedShop.value || !list.includes(selectedShop.value)) {
      selectedShop.value = list[0] || null;
    }
  },
  { immediate: true }
);

function selectShop(shop) {
  selectedShop.value = shop;
}

function viewIngredients() {
  if (!selectedShop.value) return;
  // TODO: plus tard -> router vers /shops/:id/ingredients
  alert(`TODO: show ingredients for shop #${selectedShop.value.IDShop}`);
}

function openWebsiteOrPhone() {
  if (!selectedShop.value) return;

  if (selectedShop.value.Website) {
    window.open(selectedShop.value.Website, "_blank");
  } else if (selectedShop.value.Telephone) {
    window.location.href = `tel:${selectedShop.value.Telephone}`;
  } else {
    alert("No website or phone available for this shop.");
  }
}
</script>

<template>
  <div class="shop-page">
    <h1 class="page-title">Shop</h1>

    <div class="search-row">
      <div class="search-wrapper">
        <input
          v-model="search"
          type="text"
          placeholder="Search"
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="type-select">
        <button class="type-button">
          {{ selectedType === "All" ? "Type" : selectedType }}
          <span class="arrow">▾</span>
        </button>
        <div class="type-dropdown">
          <button
            v-for="type in shopTypes"
            :key="type"
            class="type-option"
            @click="selectedType = type"
          >
            {{ type === "All" ? "All types" : type }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="status">Loading shops...</div>
    <div v-else-if="error" class="status error">Error: {{ error }}</div>

    <div v-else class="content-layout">
      <!-- liste des shops à gauche -->
      <aside class="shop-list">
        <button
          v-for="shop in filteredShops"
          :key="shop.IDShop"
          class="shop-list-item"
          :class="{ active: selectedShop && selectedShop.IDShop === shop.IDShop }"
          @click="selectShop(shop)"
        >
          <div class="shop-list-name">{{ shop.ShopName }}</div>
          <div class="shop-list-type">{{ shop.Type }}</div>
        </button>

        <p v-if="filteredShops.length === 0" class="no-results">
          No shop matches your search.
        </p>
      </aside>

      <!-- fiche détaillée du shop sélectionné -->
      <main v-if="selectedShop" class="shop-detail">
        <div class="detail-top">
          <div class="shop-picture-placeholder">
            Shop picture
          </div>

          <div class="shop-info">
            <h2>{{ selectedShop.ShopName }}</h2>
            <p class="position">{{ selectedShop.Type }}</p>
            <p class="label">Opening hours</p>
            <p>{{ selectedShop.OpenTime }}</p>
            <p class="label">Address</p>
            <p>{{ selectedShop.Adress }}</p>
          </div>
        </div>

        <section class="about">
          <h3>About</h3>
          <p>
            {{ selectedShop.About || "No description available for this shop." }}
          </p>
        </section>

        <div class="buttons-row">
          <button class="primary-btn" @click="viewIngredients">
            View shop ingredients
          </button>
          <button class="secondary-btn" @click="openWebsiteOrPhone">
            Website / Phone
          </button>
        </div>
      </main>

      <main v-else class="shop-detail">
        <p class="status">No shop selected.</p>
      </main>
    </div>
  </div>
</template>

<style scoped>
.shop-page {
  padding: 2rem 4rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.page-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.search-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2.5rem 0.7rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #555;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.type-select {
  position: relative;
}

.type-button {
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  border: 1px solid #555;
  background: #222;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

.type-select:hover .type-dropdown {
  display: block;
}

.arrow {
  margin-left: 0.5rem;
}

/* dropdown */
.type-dropdown {
  position: absolute;
  top: 105%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.3rem 0;
  display: none;
  min-width: 150px;
  z-index: 10;
}

.type-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.9rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.type-option:hover {
  background: #f3f3f3;
}

.content-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

/* liste à gauche */
.shop-list {
  border-right: 1px solid #eee;
  padding-right: 1rem;
}

.shop-list-item {
  width: 100%;
  text-align: left;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  margin-bottom: 0.4rem;
}

.shop-list-item:hover {
  background: #f8f8f8;
}

.shop-list-item.active {
  border-color: #ff8800;
  background: #fff3e6;
}

.shop-list-name {
  font-weight: 600;
}

.shop-list-type {
  font-size: 0.8rem;
  color: #555;
}

.no-results {
  font-size: 0.9rem;
  color: #777;
}

/* fiche détail */
.shop-detail {
  padding: 0.5rem 0;
}

.detail-top {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.shop-picture-placeholder {
  width: 220px;
  height: 180px;
  border-radius: 8px;
  background: #7a2cff; /* violet comme ton wireframe */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.shop-info h2 {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
}

.position {
  margin-bottom: 0.6rem;
  color: #555;
}

.label {
  font-weight: 600;
  margin-top: 0.4rem;
}

.about {
  margin-top: 1.5rem;
}

.about h3 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.buttons-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  border: 2px solid #000;
  font-size: 1rem;
  cursor: pointer;
}

.primary-btn {
  background: #ffa346;
}

.secondary-btn {
  background: #fff;
}

.status {
  margin-top: 1rem;
  color: #555;
}

.status.error {
  color: red;
}
</style>
