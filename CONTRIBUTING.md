# Contributing to LearnHubAI

## 1. Development Principles

All contributions should maintain the existing project architecture and coding standards.

## 2. Before Making Changes

- Review the existing folder structure.
- Read the project documentation.
- Inspect related components.
- Understand API dependencies.
- Identify the actual issue.

## 3. Coding Standards

- Use functional React components.
- Follow existing naming conventions.
- Keep components reusable.
- Keep API logic organized.
- Avoid unnecessary dependencies.
- Remove unused imports.
- Handle errors appropriately.
- Maintain responsive styling.

## 4. Component Guidelines

Components should have a clear responsibility.

Avoid:

- Extremely large components.
- Duplicate business logic.
- Unnecessary state.
- Unnecessary API calls.

## 5. API Guidelines

- Reuse the configured Axios instance.
- Use existing API service modules.
- Verify endpoint details.
- Handle unsuccessful responses.
- Avoid exposing sensitive information.

## 6. Git Workflow

### Check changes

```bash
git status
```

### Stage files

```bash
git add .
```

### Commit changes

```bash
git commit -m "Describe your changes"
```

### Push changes

```bash
git push
```

## 7. Testing

Before submitting changes:

- Verify affected pages.
- Test API requests.
- Test authentication.
- Test role permissions.
- Check browser console errors.
- Check responsive layouts.
- Verify existing features.

## 8. Documentation

Update the appropriate Markdown files when changing application behavior or architecture.
