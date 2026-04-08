---
name: MBC Radio App Project Details
description: Comprehensive project overview of MBC Radio app - streaming, features, architecture, and deployment
type: project
---

## Project Overview

**Project**: MBC 표준FM 라디오 웹 앱  
**Purpose**: Allow Australians to stream Korean MBC Standard FM (Seoul 95.9MHz) seamlessly  
**Status**: Completed and deployed to production  
**Repository**: https://github.com/kimjiho680629/mbc_fm-radio-app  
**Deployment**: https://mbc-radio-app.vercel.app (Vercel)

## Key Technical Details

### Tech Stack
- **Framework**: Next.js 16, React 19, TypeScript 6
- **Streaming**: HLS.js 1.6.15 with auto-reconnect
- **Styling**: Tailwind CSS v4 (migrated from v3)
- **Animation**: Framer Motion 12.38
- **UI**: Custom components (6 total)
- **Custom Hooks**: 3 (useRadioPlayer, useBroadcastInfo, useScheduledPlay)

### Core Features Implemented
1. **HLS Streaming** - Dynamic token retrieval via `/api/stream?mode=url` endpoint
2. **Auto-Reconnection** - Exponential backoff up to 5 retries
3. **Background Playback** - MediaSession API for lock-screen and tab minimization
4. **Scheduled Listening** - AEST-based scheduled playback with localStorage
5. **Broadcast Info** - Real-time KST schedule display + KST/AEST dual timezone
6. **Modern UI** - Particle canvas, rotating vinyl record, 40-bar EQ visualizer, glassmorphism design

### Critical Implementation Details

#### Stream URL Discovery
- **Challenge**: MBC doesn't expose official API
- **Solution**: Reverse-engineered `miniwebapp.imbc.com` JS bundle
- **Found**: `sminiplay.imbc.com/aacplay.ashx?channel=sfm&agent=webapp&cmp=m`
- **Implementation**: Node.js runtime API proxy with Referer/User-Agent spoofing

#### Runtime Selection
- **Issue**: Vercel Edge Runtime blocks MBC server connections
- **Resolution**: `export const runtime = "nodejs"` in API route
- **Trade-off**: Slightly longer cold start but guaranteed reliability

#### Tailwind v4 Migration
- Changed: `@tailwind` directives → `@import "tailwindcss"`
- Added: `@tailwindcss/postcss` plugin to postcss.config.js
- Result: Full v3 compatibility maintained

## Architecture Decisions

### API Design
- **Mode 1**: `?mode=url` - Returns JSON with HLS URL (client-side HLS.js playback)
- **Mode 2**: `?mode=proxy` - Full stream proxy (unused in current implementation)

### State Management
- `useRadioPlayer`: Centralized audio state (playerState, volume, retryCount)
- `useBroadcastInfo`: Real-time program schedule with timezone conversion
- `useScheduledPlay`: localStorage-persisted schedules with 1-second check interval

### Error Handling
- Exponential backoff: `delay = min(1000 * 2^(n-1), 30000)` (max 30 seconds)
- Fatal error recovery: HLS.js handles NETWORK_ERROR and MEDIA_ERROR internally
- UI feedback: "재연결 중... (N/5)" for user visibility

## File Structure

```
src/
├── app/
│   ├── page.tsx (347 lines) - Main component with all sections
│   ├── layout.tsx - Root layout
│   ├── globals.css - Tailwind v4 setup
│   └── api/stream/route.ts (67 lines) - MBC token API
├── hooks/
│   ├── useRadioPlayer.ts (268 lines) - HLS.js + auto-reconnect
│   ├── useBroadcastInfo.ts (80 lines) - Schedule + timezone
│   └── useScheduledPlay.ts (79 lines) - Scheduled playback
└── components/
    ├── VinylRecord.tsx - Rotating vinyl
    ├── EqVisualizer.tsx - 40-bar EQ
    ├── PlayerControls.tsx - Play/volume/mute
    ├── BroadcastInfo.tsx - Program info + times
    ├── SchedulePanel.tsx - Schedule management
    └── ParticleBackground.tsx - Canvas particles
```

## Known Issues & Resolutions

| Issue | Status | Notes |
|-------|--------|-------|
| Vercel Edge Runtime blocks MBC | RESOLVED | Switched to Node.js runtime |
| Tailwind v4 directives | RESOLVED | Updated postcss config |
| Browser autoplay policy | MITIGATED | Show "클릭하세요" error message |
| HLS.js CDN latency | MONITORED | Using lowLatencyMode + backBufferLength=90 |
| Unofficial API stability | ONGOING | MBC may change endpoint anytime |

## Metrics

- **Bundle Size**: ~150 KB (gzipped)
- **Lines of Code**: ~1,500+
- **TypeScript Coverage**: 100%
- **Component Count**: 6 custom components
- **Hook Count**: 3 custom hooks
- **API Endpoints**: 1 (stream)

## Deployment Status

- **Vercel**: ✅ Active production deployment
- **GitHub**: ✅ Main branch auto-deploy enabled
- **API Verification**: ✅ `/api/stream?mode=url` returns valid HLS URL
- **Domain**: https://mbc-radio-app.vercel.app

## Future Improvement Ideas

### Short-term
1. Monitor MBC API changes (health check endpoint)
2. Increase retry limit beyond 5
3. Add network status indicator

### Medium-term
1. Support other MBC channels (경FM, etc.)
2. Recording feature (save HLS segments)
3. Program favorites system
4. Dark/light mode toggle

### Long-term
1. iOS/Android PWA version
2. Desktop Electron app
3. Live chat or comments per program
4. Premium tier (hi-fi stream, ad-free)

## Why This Matters

- Connects Australia's Korean community to homeland culture
- Demonstrates reverse-engineering and API proxying patterns
- Shows practical use of modern React/Next.js features
- Solves real regional restriction problem with elegant solution

---

**Report Location**: `/mnt/storage/Claude_Job/mbc-radio-app/docs/04-report/features/mbc-radio.report.md`  
**Last Updated**: 2026-04-08
