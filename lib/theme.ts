export function applyTheme(primary: string, secondary: string) {
    document.documentElement.style.setProperty("--color-primary", primary)
    document.documentElement.style.setProperty("--color-secondary", secondary)
  }
  