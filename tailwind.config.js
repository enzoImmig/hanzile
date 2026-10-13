/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg-canvas)',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          hover: 'var(--bg-surface-hover)',
        },
        feedback: {
          correct: 'var(--color-correct)',
          'correct-border': 'var(--color-correct-border)',
          partial: 'var(--color-partial)',
          'partial-border': 'var(--color-partial-border)',
          wrong: 'var(--color-wrong)',
          'wrong-border': 'var(--color-wrong-border)',
        },
        accent: {
          purple: 'var(--accent-purple)',
          'purple-hover': 'var(--accent-purple-hover)',
          red: 'var(--accent-red)',
          yellow: 'var(--accent-yellow)',
        },
        app: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          border: 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        cjk: ['var(--font-cjk)', '"Noto Sans SC"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        }
      },
      animation: {
        flip: 'flip 0.45s ease forwards',
      }
    },
  },
  plugins: [],
}
