---
pagination:
  data: pages
  size: 1
  alias: p
  addAllPagesToCollections: true
permalink:
  build: /{{ p }}
  preview: /preview/:slug
pages:
  - foo
  - bar
  - baz
---

# {{ p }}
