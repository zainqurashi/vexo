export function renderNotFound() {
  return `
    <div class="container section-padding" style="min-height: 70vh; display: flex; align-items: center; justify-content: center;">
      <div class="empty-state-card" style="max-width: 600px; width: 100%;">
        <div class="empty-state-emblem">
          <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-gold);">404</span>
        </div>
        <p class="empty-state-tag">Elevation Not Located</p>
        <h1 class="empty-state-heading">Page Not Found</h1>
        <p class="empty-state-description">
          The sanctuary or product you are seeking has been moved, archived, or does not exist in our current collection.
        </p>

        <div class="empty-state-actions" style="margin-top: 2rem;">
          <a href="#/" class="btn btn-gold">Return to Home</a>
          <a href="#/catalog" class="btn btn-outline-gold">Explore Catalog →</a>
        </div>
      </div>
    </div>
  `;
}
