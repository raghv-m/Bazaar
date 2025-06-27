# Bazaar
Bazaar – A full-stack cross-platform e-commerce marketplace with mobile and web apps. Features real-time AI chat support (OpenAI), automated image fetching, secure payments (Stripe), and modern UX with CI/CD and JWT authentication.

## Continuous Integration & Deployment
This repository includes GitHub Actions workflows for automatic testing and Docker image deployment:

- **CI** (`.github/workflows/ci.yml`) runs on every push and pull request. It installs Node dependencies and executes `npm test` when a `package.json` file is present.
- **CD** (`.github/workflows/cd.yml`) builds and pushes a Docker image to GitHub Container Registry whenever a commit is pushed to `main` (or a version tag) and a `Dockerfile` exists.

These pipelines provide a starting point for automated builds and can be extended as the project evolves.
