/**
 * RASA RESTAURANT — menu-filter.js
 * Handles:
 * - Menu tab switching (Starters / Mains / Desserts / Drinks)
 * - Dietary filter buttons (All / Vegetarian / Vegan / GF / Spicy)
 * - Animated transitions between panels and item visibility
 */

'use strict';

(function () {
  /* ─────────────────────────────────────
     TAB SWITCHING
     ───────────────────────────────────── */

  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        // Update tab active states
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panel visibility
        panels.forEach((panel) => {
          if (panel.id === `tab-${target}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });

        // Reset dietary filter to "All" when switching tabs
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilterBtn) {
          document.querySelectorAll('.filter-btn').forEach((fb) => fb.classList.remove('active'));
          allFilterBtn.classList.add('active');
          showAllItems();
        }
      });
    });
  }

  /* ─────────────────────────────────────
     DIETARY FILTER
     ───────────────────────────────────── */

  function showAllItems() {
    const activePanel = document.querySelector('.menu-panel.active');
    if (!activePanel) return;

    const items = activePanel.querySelectorAll('.menu-item');
    items.forEach((item) => {
      item.classList.remove('hidden');
    });
  }

  function filterItems(filterTag) {
    if (filterTag === 'all') {
      showAllItems();
      return;
    }

    const activePanel = document.querySelector('.menu-panel.active');
    if (!activePanel) return;

    const items = activePanel.querySelectorAll('.menu-item');

    items.forEach((item) => {
      const tags = item.getAttribute('data-tags') || '';
      const tagList = tags.trim().split(/\s+/);

      if (tagList.includes(filterTag)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  function initDietaryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active state
        filterBtns.forEach((fb) => fb.classList.remove('active'));
        btn.classList.add('active');

        // Apply filter
        filterItems(filter);
      });
    });
  }

  /* ─────────────────────────────────────
     INIT
     ───────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initMenuTabs();
    initDietaryFilters();
  });
})();
