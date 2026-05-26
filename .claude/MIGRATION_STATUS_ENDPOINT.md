# Status Endpoint Migration Notice

## Migration Summary

**Date**: May 26, 2026  
**Status**: COMPLETED  
**Impact**: Status endpoint deployment moved from Fused-Gaming-Skill-MCP to PeraltaCC

## What Changed

The PeraltaCC project status endpoint has been migrated from the Fused-Gaming-Skill-MCP repository to the PeraltaCC repository where it properly belongs.

### Deprecated Files (in this repository)

- `/.claude/status-endpoint-config.json` - **DEPRECATED** (was tracking Skill-MCP project status, not PeraltaCC)

### New Locations (in PeraltaCC repository)

- `/home/user/PeraltaCC/.claude/status-endpoint-config.json` - **NEW** (tracks PeraltaCC project status)
- `/home/user/PeraltaCC/src/status.js` - Project status class
- `/home/user/PeraltaCC/src/status-server.js` - Express.js status API server
- `/home/user/PeraltaCC/src/orchestration-controller.js` - Agent swarm orchestration controller
- `/home/user/PeraltaCC/vercel.json` - Vercel deployment configuration with status endpoint metadata

### npm Scripts Added to PeraltaCC

```bash
npm run start:status      # Start status endpoint locally (port 3000)
npm run start:status:prod # Start status endpoint for production (port 3001)
npm run status:config     # Display status endpoint configuration
```

## Why This Migration

1. **Ownership**: The PeraltaCC project should own and manage its own status endpoint
2. **Deployment Target**: Status endpoint should deploy to peralta.vln.gg (PeraltaCC Vercel project), not to the Skill-MCP web dashboard
3. **Configuration Accuracy**: The configuration was incorrectly tracking Skill-MCP project metrics instead of PeraltaCC RFP compliance metrics
4. **Architecture Clarity**: Separates concerns between two distinct projects

## Status Endpoint Architecture

**PeraltaCC Status Endpoint**:
- Monitors RFP 25-26-09 proposal development progress
- Tracks 8-agent swarm for proposal automation
- Exposes 6 quality gates for compliance verification
- Provides real-time metrics and project status

**Endpoints**:
- `GET /health` - Basic health check
- `GET /status` - Complete project status
- `GET /status/agents` - Agent swarm metrics
- `GET /status/gates` - Quality gate progression
- `GET /status/compliance` - RFP compliance status
- `GET /status/metrics` - Execution metrics

**Deployment**: peralta.vln.gg (Vercel static site with status API)

## What to Do with This File

This file (`MIGRATION_STATUS_ENDPOINT.md`) documents the migration for future reference. The deprecated `status-endpoint-config.json` can be archived or removed from this repository after confirming the new PeraltaCC deployment is working.

## References

- PeraltaCC Status Configuration: `/home/user/PeraltaCC/.claude/status-endpoint-config.json`
- PeraltaCC Repository: `/home/user/PeraltaCC/`
- Vercel Deployment: https://peralta.vln.gg
- GitBook Workspace: https://open-2v.gitbook.com/

## Questions?

For status endpoint questions, refer to:
1. PeraltaCC `.claude/status-endpoint-config.json` for configuration details
2. PeraltaCC `src/status.js` for implementation
3. Context7 MCP context at `/root/.claude/context7.json` for deployment architecture
