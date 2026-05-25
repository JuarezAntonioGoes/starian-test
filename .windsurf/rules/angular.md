---
trigger: always_on
---

# Angular conventions

- Never add `standalone: true` to `@Component`, `@Directive` or `@Pipe` decorators. Angular 19+ enables standalone by default — the property is redundant and should be omitted.
