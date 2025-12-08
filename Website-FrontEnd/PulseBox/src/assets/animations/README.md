# Lottie Animations for How It Works Section

This folder is for Lottie animation JSON files that will replace the static onboarding images in the `HowItWorksSection`.

## How to Add Lottie Animations

1. **Download Lottie JSON files** from [LottieFiles.com](https://lottiefiles.com)
   - Search for animations related to: education, teaching, onboarding, setup, etc.
   - Download as JSON format

2. **Save the files** in this folder with these names:
   - `onboarding-01.json` (for Step 1: Get Started)
   - `onboarding-02.json` (for Step 2: Generate with AI)
   - `onboarding-03.json` (for Step 3: Manage Daily Tasks)
   - `onboarding-04.json` (for Step 4: Analyze & Improve)

3. **Uncomment the imports** in `HowItWorksSection.tsx`:
   ```tsx
   import onboarding01Animation from '../../assets/animations/onboarding-01.json';
   import onboarding02Animation from '../../assets/animations/onboarding-02.json';
   import onboarding03Animation from '../../assets/animations/onboarding-03.json';
   import onboarding04Animation from '../../assets/animations/onboarding-04.json';
   ```

4. **Update the animation array** in `HowItWorksSection.tsx`:
   ```tsx
   const onboardingAnimations = [
       onboarding01Animation,
       onboarding02Animation,
       onboarding03Animation,
       onboarding04Animation
   ];
   const onboardingAnimation = onboardingAnimations[index];
   ```

5. **Remove the fallback** (optional):
   - Set `onboardingAnimation` to use the animations array
   - The component will automatically use Lottie if available, fallback to images if not

## Recommended Animation Themes

- **Step 1 (Get Started)**: User registration, profile setup, account creation
- **Step 2 (Generate with AI)**: AI/robot, document generation, magic wand
- **Step 3 (Manage Daily Tasks)**: Checklist, calendar, task management
- **Step 4 (Analyze & Improve)**: Charts, graphs, analytics, growth

## Tips

- Keep file sizes under 500KB for better performance
- Choose animations that match your brand colors (purple/violet theme)
- Test animations in both light and dark themes
- Ensure animations loop smoothly

