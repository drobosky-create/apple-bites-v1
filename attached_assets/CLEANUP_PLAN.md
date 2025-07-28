# Attached Assets Cleanup Plan
**Phase 1: Immediate Safe Removals**

## Files to Remove (Safe - Already integrated into codebase)
1. **Legacy Argon Component Files (152 files)**
   - All `.js` files from Argon Dashboard imports
   - Material UI theme duplicates
   - Component definitions now in main codebase

2. **Duplicate Development Images**
   - Numbered duplicates (1.png, 2.png, 3.png, 4.png)
   - Timestamp duplicates with same content
   - Old Apple Bites logo versions (consolidated to universal system)

## Files to Archive (Move to organized structure)

### Create Archive Structure:
```
docs/
├── archive/
│   ├── screenshots/
│   ├── development-videos/
│   ├── user-feedback/
│   └── legacy-assets/
├── brand/
│   ├── logos/
│   └── guidelines/
└── data/
    ├── naics/
    └── templates/
```

### Archive Categories:
1. **Screenshots (68 files)** → `docs/archive/screenshots/`
2. **User Feedback Text Files (~30)** → `docs/archive/user-feedback/`
3. **Development Videos (2 files)** → `docs/archive/development-videos/`
4. **Legacy Brand Assets** → `docs/archive/legacy-assets/`

## Files to Keep Active
1. **Business Data Files**
   - NAICS Excel file
   - JSON assessment templates
   - PDF examples

2. **Current Brand Assets**
   - Apple Bites logos (organized versions)
   - Meritage Partner logos
   - Current brand guidelines

3. **Recent User Requirements**
   - Latest feedback files (July 2025)
   - Current specifications

## Implementation Commands
```bash
# Phase 1: Remove legacy code files
rm attached_assets/*.js

# Phase 2: Create archive structure
mkdir -p docs/archive/{screenshots,development-videos,user-feedback,legacy-assets}
mkdir -p docs/{brand,data}

# Phase 3: Move files to archive
mv attached_assets/Screenshot* docs/archive/screenshots/
mv attached_assets/IMG_* docs/archive/screenshots/
mv attached_assets/ScreenRecording* docs/archive/development-videos/
mv attached_assets/Pasted-* docs/archive/user-feedback/

# Phase 4: Organize active files
mv attached_assets/*NAICS* docs/data/
mv attached_assets/*.json docs/data/
```

## Expected Results
- **Reduce from 624 → ~50 active files**
- **Organized project structure**
- **Improved navigation and performance**
- **Clear separation of active vs archive content**

## Rollback Plan
All moved files will be preserved in organized archive structure, allowing easy retrieval if needed.