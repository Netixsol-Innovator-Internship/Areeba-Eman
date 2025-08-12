# Day-2 Portfolio Page

A responsive **portfolio landing page** built with **HTML** and **Tailwind CSS**, featuring:
- **Light/Dark mode toggle** with smooth animations
- Fixed light/dark mode image switching for the logo
- Fully responsive navigation bar
- Gradient text for the name
- Social media icon links with hover effects
- Download CV button
- Creative right-side artwork section (visible on large screens only)

---

## 🚀 Features

### 🎨 Dark/Light Mode Toggle
- Switches between **light** and **dark** themes using Tailwind's `darkMode: 'class'` configuration.
- Smooth color transitions with `transition-colors` and `duration-300`.
- Logo changes automatically based on the theme.

### 📱 Responsive Layout
- Mobile-first design with `flex`, `hidden`, and `block` utilities.
- Navigation links hidden on small screens and visible from `md` breakpoint.
- Right-side image is hidden on smaller screens for better layout.

### 🖌 Styled Components
- **Google Fonts**: Inter
- Gradient text for highlighted name
- Border hover effects for social media icons
- Call-to-action buttons with hover animations


## ⚙️ How It Works

1. **Tailwind CSS** is loaded via CDN with a custom configuration for font family and dark mode.
2. The `<html>` element starts with the `dark` class for default dark mode.
3. The toggle button updates:
   - The HTML `classList` to add/remove `dark`
   - The toggle's background color
   - The slider position (`translate-x`)
4. Logo image switches using `dark:block` and `dark:hidden`.

---

## 🖼 Logo Switching Logic

```html
<!-- Dark mode logo -->
<div class="w-12 h-8 hidden dark:block">
  <img src="images/Logo.svg" alt="Logo" />
</div>

<!-- Light mode logo -->
<div class="w-12 h-8 dark:hidden">
  <img src="images/logoo2.svg" alt="Logo" />
</div>
