# Overview

SupaBros Edu is a comprehensive educational platform offering 50+ programming languages with structured tutorials from beginner to fullstack development. The application features interactive code editors, syntax highlighting, comprehensive course content, and hands-on exercises. Built as a complete W3Schools clone, it covers every major programming language including frontend (HTML, CSS, JavaScript, React, Vue), backend (Python, Java, Node.js, C#, Go), mobile (Swift, Dart, Flutter), data science (R, MATLAB, Julia), functional programming (Haskell, Lisp), and specialized domains (Solidity, VHDL). The platform provides an engaging learning experience with real-world programming examples and progressive skill development.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Routing**: Wouter for lightweight client-side routing with support for dynamic routes like `/tutorial/:slug`
- **State Management**: TanStack Query (React Query) for server state management, caching, and data fetching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming, supporting both light and dark modes
- **Build Tool**: Vite for fast development and optimized production builds with Hot Module Replacement

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features and type safety
- **API Design**: REST endpoints following conventional patterns (`/api/courses`, `/api/tutorials`) with proper HTTP status codes
- **Development**: Custom Vite integration for seamless full-stack development with middleware support

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM with type-safe schema definitions
- **ORM**: Drizzle ORM for database interactions with automatic TypeScript type generation
- **Schema**: Structured tables for courses, tutorials, and user progress with proper foreign key relationships
- **Development Storage**: In-memory storage implementation with comprehensive seeded data covering 50+ programming languages
- **Course Coverage**: Frontend (HTML, CSS, JavaScript, TypeScript, React, Vue, Angular, Svelte), Backend (Python, Java, C#, Node.js, PHP, Ruby, Go, Rust, Kotlin, Scala), Systems (C, C++, Assembly, D, Nim, Zig), Mobile (Swift, Dart, Flutter, React Native), Database (SQL, NoSQL, GraphQL), Data Science (R, MATLAB, Julia), Scripting (Bash, PowerShell, Perl, Lua), Functional (Haskell, Lisp, Scheme, F#, OCaml), and Specialized (Solidity, VHDL, Verilog)
- **Tutorial Structure**: Each language includes beginner to advanced tutorials with progressive learning paths, code examples, and best practices
- **Migrations**: Drizzle Kit for database schema migrations and management

## Component Architecture
- **Design System**: Consistent component library with variant-based styling using class-variance-authority
- **Layout Components**: Modular header, sidebar, and navigation components with responsive behavior
- **Interactive Elements**: Custom code editor with syntax highlighting, copy functionality, and simulated code execution
- **UI Patterns**: Card-based layouts, breadcrumb navigation, and progress indicators for enhanced user experience

## Development Environment
- **Code Quality**: TypeScript strict mode with comprehensive type checking and path mapping for clean imports
- **Development Tools**: Hot reload, error overlay, and development banners for improved developer experience
- **Font Loading**: Custom font integration (Inter, JetBrains Mono) for consistent typography across the platform

# External Dependencies

## Database Services
- **@neondatabase/serverless**: PostgreSQL database connection with serverless compatibility
- **connect-pg-simple**: PostgreSQL session store for user session management

## UI and Styling
- **@radix-ui/***: Comprehensive suite of accessible UI primitives (dialogs, dropdowns, navigation, forms)
- **tailwindcss**: Utility-first CSS framework with custom theme configuration
- **class-variance-authority**: Type-safe variant API for component styling
- **embla-carousel-react**: Touch-friendly carousel component for content display

## Development and Build Tools
- **vite**: Build tool and development server with React plugin support
- **@vitejs/plugin-react**: React integration for Vite with Fast Refresh
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting for Replit environment
- **tsx**: TypeScript execution engine for server-side development

## Form and Data Handling
- **react-hook-form**: Performant form library with validation support
- **@hookform/resolvers**: Validation resolvers for form validation integration
- **zod**: Schema validation library integrated with Drizzle for type-safe data validation

## Additional Libraries
- **date-fns**: Date manipulation and formatting utilities
- **cmdk**: Command palette component for enhanced navigation
- **lucide-react**: Modern icon library with React components
- **nanoid**: URL-safe unique ID generator for entity creation