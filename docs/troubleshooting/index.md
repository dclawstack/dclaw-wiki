# Troubleshooting

Common issues and solutions for DClaw Wiki.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-wiki

# Check logs
kubectl logs -n dclaw-wiki deployment/dclaw-wiki-backend

# Check database
kubectl get clusters -n dclaw-wiki
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)
