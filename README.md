# My-Portfolio
Folder name: controller => controllers
UserSchema: portfolioURL not required
User Route: Logout is POST requests
User Route: getUser is on route '/', not '/me'
User Route: updaate profile is on route '/update/profile', not '/me/profile/update'

# Frontend
- npm create vite@latest ./ -- --template react
- npm install --legacy-peer-deps -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- npm install --legacy-peer-deps @react-three/fiber @react-three/drei maath react-tilt react-vertical-timeline-component @emailjs/browser framer-motion react-router-dom three

# Frontend Modification
- Change personal info from `/frontend/constants/index.js`
- Create your own logo. You can try [logo.com](https://logo.com/) and replace with the `logo.svg` file in `/frontend/src/assets/logo.svg` and `/frontend/public/logo.svg`

# Frontend TODO in main release
- Make `/frontend/index.html` environmental variable dependent for **title** and **logo url**
- Change the lightings of the computer model as per you from `/frontend/src/components/canvas/Computer.jsx`
- Make `/frontend/src/components/Hero.jsx` environmental variable dependent for **name** and **short introduction**