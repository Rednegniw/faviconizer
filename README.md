# Faviconizer

A free online tool to convert any image into a favicon. Upload an image, crop it if needed, and download a favicon in ICO, PNG, or JPG format.

This is a fun, personal project I built mostly to try out SvelteKit with Svelte 5 and Tailwind CSS v4. I also created it because I was annoyed that there isn't a simple, non-bloated online tool to do this.

I don't have any further plans for it, but I hope it can be useful to someone!

**Live at [faviconizer.com](https://faviconizer.com)**

## Features

- Drag-and-drop or file picker upload
- Automatic square detection (skips cropping for square images)
- Built-in cropping tool for non-square images
- Configurable output size (8px to 128px)
- Multiple output formats: ICO, PNG, JPG
- Dark mode support
- Rate limiting and automatic file cleanup

## Tech Stack

- [SvelteKit](https://svelte.dev) with Svelte 5
- [Tailwind CSS](https://tailwindcss.com) v4
- [Sharp](https://sharp.pixelplumbing.com) for server-side image processing
- [Supabase](https://supabase.com) for file storage
- [Upstash Redis](https://upstash.com) for rate limiting
- [Sentry](https://sentry.io) for error tracking
- [PostHog](https://posthog.com) for analytics
- Deployed on [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 18+)
- A Supabase project with a `favicons` storage bucket
- An Upstash Redis instance

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Rednegniw/faviconizer.git
cd faviconizer
```

2. Install dependencies:

```bash
bun install
```

3. Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See `.env.example` for all required variables.

4. Start the dev server:

```bash
bun run dev
```

### Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `bun run dev`     | Start development server       |
| `bun run build`   | Build for production           |
| `bun run preview` | Preview production build       |
| `bun run check`   | Run Svelte type checking       |
| `bun run lint`    | Run linter and formatter check |
| `bun run format`  | Format code with Prettier      |

## License

[MIT](LICENSE)
