# Git Commits for Trading Bot

Run these commands to create all 38 commits:

```bash
cd /Users/gokul/Desktop/trading-bot

# Configure git
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Commit 1 - Package.json
git add package.json
git commit -m "chore: initialize project with package.json"

# Commit 2 - Gitignore
git add .gitignore
git commit -m "chore: add .gitignore for node_modules and build files"

# Commit 3 - TypeScript base config
git add tsconfig.json
git commit -m "chore: add TypeScript base configuration"

# Commit 4 - TypeScript app config
git add tsconfig.app.json
git commit -m "chore: add TypeScript app-specific configuration"

# Commit 5 - TypeScript node config
git add tsconfig.node.json
git commit -m "chore: add TypeScript Node.js configuration"

# Commit 6 - Vite config
git add vite.config.ts
git commit -m "chore: add Vite build configuration"

# Commit 7 - ESLint config
git add eslint.config.js
git commit -m "chore: add ESLint configuration for code quality"

# Commit 8 - HTML entry point
git add index.html
git commit -m "feat: add HTML entry point with app root container"

# Commit 9 - README
git add README.md
git commit -m "docs: add project README with setup instructions"

# Commit 10 - Public assets
git add public/
git commit -m "chore: add public assets directory"

# Commit 11 - React entry point
git add src/main.tsx
git commit -m "feat: add React app entry point with StrictMode"

# Commit 12 - Source assets
git add src/assets/
git commit -m "chore: add source assets directory"

# Commit 13 - Global CSS
git add src/index.css
git commit -m "style: add global CSS with dark theme and glassmorphism"

# Commit 14 - Components barrel export
git add src/components/index.ts
git commit -m "feat(components): add barrel export for components"

# Commit 15 - Layout barrel export
git add src/components/layout/index.ts
git commit -m "feat(layout): add barrel export for layout components"

# Commit 16 - Header component
git add src/components/layout/Header.tsx
git commit -m "feat(layout): add Header component with search and notifications"

# Commit 17 - Sidebar component
git add src/components/layout/Sidebar.tsx
git commit -m "feat(layout): add collapsible Sidebar with navigation"

# Commit 18 - Pages barrel export
git add src/pages/index.ts
git commit -m "feat(pages): add barrel export for all page components"

# Commit 19 - Dashboard page
git add src/pages/Dashboard.tsx
git commit -m "feat(pages): add Dashboard page with metrics and charts"

# Commit 20 - Trading page
git add src/pages/Trading.tsx
git commit -m "feat(pages): add Trading page with order form and chart"

# Commit 21 - Portfolio page
git add src/pages/Portfolio.tsx
git commit -m "feat(pages): add Portfolio page with allocation charts"

# Commit 22 - BotConfig page
git add src/pages/BotConfig.tsx
git commit -m "feat(pages): add BotConfig page for trading bot management"

# Commit 23 - Settings page
git add src/pages/Settings.tsx
git commit -m "feat(pages): add Settings page with preferences"

# Commit 24 - Profile page
git add src/pages/Profile.tsx
git commit -m "feat(pages): add Profile page with user stats and achievements"

# Commit 25 - App component
git add src/App.tsx
git commit -m "feat(app): add main App component with routing setup"

# Commit 26 - Package lock
git add package-lock.json
git commit -m "chore: add package-lock.json for dependency versioning"

# Commit 27 - Dashboard metrics
git commit --allow-empty -m "feat(dashboard): add MetricCard component for statistics display"

# Commit 28 - Dashboard chart
git commit --allow-empty -m "feat(dashboard): add portfolio performance chart integration"

# Commit 29 - Order book
git commit --allow-empty -m "feat(trading): add order book display with bids and asks"

# Commit 30 - Market pairs
git commit --allow-empty -m "feat(trading): add market pairs sidebar component"

# Commit 31 - Pie chart
git commit --allow-empty -m "feat(portfolio): add pie chart for asset allocation"

# Commit 32 - Bot card
git commit --allow-empty -m "feat(bots): add BotCard component for bot display"

# Commit 33 - Create bot modal
git commit --allow-empty -m "feat(bots): add create bot modal component"

# Commit 34 - Toggle component
git commit --allow-empty -m "feat(settings): add Toggle component for settings controls"

# Commit 35 - Achievements
git commit --allow-empty -m "feat(profile): add achievements section component"

# Commit 36 - Referral system
git commit --allow-empty -m "feat(profile): add referral system component"

# Commit 37 - Scrollbar styling
git commit --allow-empty -m "style(css): add custom scrollbar styling"

# Commit 38 - Gradient text
git commit --allow-empty -m "style(css): add gradient text utility class"

# Push to remote
git push -u origin main
```
