# Menu - Food Explorer App

A modern food discovery and ordering app built with Expo and Supabase.

## Features

- 🔐 **Authentication**: Secure sign up/sign in with Supabase Auth
- 👤 **User Profiles**: Personalized profiles with order history and achievements
- 🍽️ **Food Discovery**: Browse restaurants, dishes, and cuisines
- 🛒 **Order Management**: Track orders and favorites
- 💰 **Budget Tracking**: Monitor food spending with insights
- 📱 **Mobile-First**: Optimized for mobile with beautiful UI

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: Expo Router
- **Styling**: StyleSheet with custom design system
- **Icons**: Lucide React Native
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the migration file in `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses the following main tables:

- **profiles**: User information and statistics
- **orders**: Order history and tracking
- **favorites**: User's favorite food items

## Authentication Flow

1. Users can browse as guests with limited functionality
2. Sign up creates a profile in the database
3. Authenticated users get full access to features
4. Profile data is automatically synced with Supabase

## Project Structure

```
app/
├── (tabs)/          # Tab navigation screens
├── auth.tsx         # Authentication screen
├── onboarding.tsx   # App introduction
└── _layout.tsx      # Root layout with auth provider

components/
├── CustomLogo.tsx   # App logo component

contexts/
├── AuthContext.tsx  # Authentication state management

lib/
├── supabase.ts      # Supabase client configuration

types/
├── database.ts      # TypeScript database types

supabase/
└── migrations/      # Database migration files
```

## Features in Detail

### Authentication
- Email/password authentication
- Guest browsing mode
- Role-based access (Customer, Delivery Partner, Vendor)
- Secure session management

### Food Discovery
- Category-based browsing
- Featured food carousel
- Search functionality
- Price display in Nigerian Naira (₦)

### User Experience
- Smooth animations and transitions
- Responsive design
- Offline-friendly architecture
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.