#!/bin/bash

# Set archive root
ARCHIVE_DIR="./src/archive"

# List of files to archive based on ts-prune output
FILES_TO_ARCHIVE=(
"src/components/AdjustmentsForm.tsx"
"src/components/admin-login.tsx"
"src/components/CoachingTips.tsx"
"src/components/AppleBitesLogo.tsx"
"src/components/AssessmentStepper.tsx"
"src/components/coin-stack-chart.tsx"
"src/components/contact-form.tsx"
"src/components/ebitda-form.tsx"
"src/components/followup-form-old.tsx"
"src/components/followup-form.tsx"
"src/components/free-progress-indicator.tsx"
"src/components/Footer.tsx"
"src/components/horizontal-grade-selector.tsx"
"src/components/industry-form.tsx"
"src/components/interactive-valuation-slider.tsx"
"src/components/LoadingModal.tsx"
"src/components/MaterialWrapper.tsx"
"src/components/mini-progress-bar.tsx"
"src/components/OperationalGradeGauge.tsx"
"src/components/password-change-form.tsx"
"src/components/password-change-modal.tsx"
"src/components/progress-indicator.tsx"
"src/components/Sidebar.tsx"
"src/components/sticky-contact-widget.tsx"
"src/components/team-login.tsx"
"src/components/tier-selection.tsx"
"src/components/valuation-form-old.tsx"
"src/components/valuation-results.tsx"
"src/components/valuation-drivers-form-old.tsx"
"src/components/valuation-drivers-form.tsx"
"src/components/valuation-drivers-heatmap.tsx"
"src/hooks/useAdminAuth.ts"
"src/hooks/useIsMobile.ts"
"src/hooks/useTeamAuth.tsx"
"src/lib/authUtils.ts"
"src/lib/queryClient.ts"
"src/lib/apiRequest.ts"
"src/pages/analytics-dashboard.tsx"
"src/pages/assessment-results.tsx"
"src/pages/free-assessment.tsx"
"src/pages/leads-dashboard.tsx"
"src/pages/past-assessments.tsx"
"src/pages/profile-test.tsx"
"src/pages/strategic-assessment.tsx"
"src/pages/team-dashboard.tsx"
"src/pages/value-calculator.tsx"
"src/theme/materialDashboardTheme.ts"
"src/utils/logoUtils.ts"
"src/components/layout/DashboardLayout.tsx"
"src/pages/_old/dashboard-complete.tsx"
"src/pages/_old/dashboard-simple.tsx"
"src/pages/_old/dashboard-tiers.tsx"
"src/pages/_old/material-dashboard-demo.tsx"
)

echo "Creating archive directory..."
mkdir -p "$ARCHIVE_DIR"

for FILE in "${FILES_TO_ARCHIVE[@]}"; do
  if [ -f "$FILE" ]; then
    TARGET="$ARCHIVE_DIR/${FILE#src/}"
    mkdir -p "$(dirname "$TARGET")"
    mv "$FILE" "$TARGET"
    echo "Moved $FILE → $TARGET"
  else
    echo "⚠️  File not found: $FILE"
  fi
done

echo "✅ Done archiving unused files."
