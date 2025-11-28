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


