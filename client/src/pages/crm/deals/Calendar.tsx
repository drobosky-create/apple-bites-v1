import { useState } from "react";
import { Box, Paper, Typography, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import { ChevronLeft, ChevronRight, MoreVert, Event } from "@mui/icons-material";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface Deal {
  id: number;
  title: string;
  value?: number;
  stage: string;
  expectedCloseDate?: string;
  firmName?: string;
  contactName?: string;
  probability?: number;
}

const STAGE_COLORS: Record<string, string> = {
  "prospecting": "#2196f3",
  "qualified": "#ff9800",
  "proposal": "#9c27b0",
  "negotiation": "#f44336",
  "closed-won": "#4caf50",
  "closed-lost": "#757575"
};

function formatCurrency(value?: number): string {
  if (!value) return "";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function CalendarDay({ 
  date, 
  deals, 
  isCurrentMonth, 
  isToday 
}: { 
  date: Date; 
  deals: Deal[]; 
  isCurrentMonth: boolean;
  isToday: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dayDeals = deals.filter(deal => 
    deal.expectedCloseDate && 
    isSameDay(new Date(deal.expectedCloseDate), date)
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (dayDeals.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MDBox
      sx={{
        minHeight: 120,
        border: '1px solid #e0e0e0',
        backgroundColor: isCurrentMonth ? 'white' : '#f5f5f5',
        cursor: dayDeals.length > 0 ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: dayDeals.length > 0 ? '#f8f9fa' : undefined,
        }
      }}
      onClick={handleMenuOpen}
    >
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        p={1}
        sx={{
          borderBottom: dayDeals.length > 0 ? '1px solid #e0e0e0' : 'none'
        }}
      >
        <MDTypography 
          variant="body2" 
          fontWeight={isToday ? "bold" : "medium"}
          color={isToday ? "info" : isCurrentMonth ? "dark" : "secondary"}
          sx={{
            backgroundColor: isToday ? '#1976d2' : 'transparent',
            color: isToday ? 'white' : undefined,
            borderRadius: isToday ? '50%' : 0,
            width: isToday ? 24 : 'auto',
            height: isToday ? 24 : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem'
          }}
        >
          {format(date, 'd')}
        </MDTypography>
        
        {dayDeals.length > 0 && (
          <Chip 
            label={dayDeals.length} 
            size="small"
            sx={{ 
              height: 18, 
              fontSize: '0.75rem',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        )}
      </MDBox>

      <MDBox p={1} sx={{ maxHeight: 80, overflowY: 'auto' }}>
        {dayDeals.slice(0, 3).map((deal) => (
          <MDBox
            key={deal.id}
            sx={{
              backgroundColor: STAGE_COLORS[deal.stage],
              color: 'white',
              p: 0.5,
              mb: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <MDTypography variant="caption" sx={{ 
              fontSize: '0.7rem',
              fontWeight: 'medium',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {deal.title}
            </MDTypography>
            {deal.value && (
              <MDTypography variant="caption" sx={{ 
                fontSize: '0.65rem',
                opacity: 0.9,
                display: 'block'
              }}>
                {formatCurrency(deal.value)}
              </MDTypography>
            )}
          </MDBox>
        ))}
        
        {dayDeals.length > 3 && (
          <MDTypography variant="caption" color="text" sx={{ fontSize: '0.7rem' }}>
            +{dayDeals.length - 3} more
          </MDTypography>
        )}
      </MDBox>

      {/* Deal Details Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { maxWidth: 300 }
        }}
      >
        <MDBox p={2}>
          <MDTypography variant="h6" mb={1}>
            Deals for {format(date, 'MMM d, yyyy')}
          </MDTypography>
          {dayDeals.map((deal) => (
            <MenuItem key={deal.id} onClick={handleMenuClose}>
              <MDBox>
                <MDTypography variant="body2" fontWeight="medium">
                  {deal.title}
                </MDTypography>
                {deal.firmName && (
                  <MDTypography variant="caption" color="text">
                    {deal.firmName}
                  </MDTypography>
                )}
                {deal.value && (
                  <MDTypography variant="caption" color="success" display="block">
                    {formatCurrency(deal.value)}
                  </MDTypography>
                )}
              </MDBox>
            </MenuItem>
          ))}
        </MDBox>
      </Menu>
    </MDBox>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/crm/deals'],
    enabled: true,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <MDTypography>Loading calendar...</MDTypography>
      </MDBox>
    );
  }

  // Calculate statistics for current month
  const monthDeals = deals.filter((deal: Deal) => {
    if (!deal.expectedCloseDate) return false;
    const dealDate = new Date(deal.expectedCloseDate);
    return dealDate >= monthStart && dealDate <= monthEnd;
  });

  const monthValue = monthDeals.reduce((sum: number, deal: Deal) => sum + (deal.value || 0), 0);

  return (
    <MDBox>
      {/* Calendar Header */}
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        p={2}
        sx={{ backgroundColor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}
      >
        <MDBox display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigateMonth('prev')}>
            <ChevronLeft />
          </IconButton>
          
          <MDTypography variant="h5" fontWeight="bold">
            {format(currentDate, 'MMMM yyyy')}
          </MDTypography>
          
          <IconButton onClick={() => navigateMonth('next')}>
            <ChevronRight />
          </IconButton>
        </MDBox>

        <MDBox display="flex" gap={3} alignItems="center">
          <MDBox textAlign="center">
            <MDTypography variant="h6" fontWeight="bold" color="info">
              {monthDeals.length}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Deals This Month
            </MDTypography>
          </MDBox>
          
          <MDBox textAlign="center">
            <MDTypography variant="h6" fontWeight="bold" color="success">
              {formatCurrency(monthValue)}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Total Value
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Calendar Grid */}
      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        {/* Weekday Headers */}
        <MDBox display="grid" gridTemplateColumns="repeat(7, 1fr)" sx={{ backgroundColor: '#f8f9fa' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <MDBox key={day} p={2} textAlign="center" sx={{ borderRight: '1px solid #e0e0e0' }}>
              <MDTypography variant="body2" fontWeight="bold" color="dark">
                {day}
              </MDTypography>
            </MDBox>
          ))}
        </MDBox>

        {/* Calendar Days */}
        <MDBox display="grid" gridTemplateColumns="repeat(7, 1fr)">
          {calendarDays.map((day) => (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              deals={deals}
              isCurrentMonth={isSameMonth(day, currentDate)}
              isToday={isSameDay(day, new Date())}
            />
          ))}
        </MDBox>
      </Paper>

      {/* Legend */}
      <MDBox mt={3} display="flex" gap={2} flexWrap="wrap">
        <MDTypography variant="body2" fontWeight="medium" mr={2}>
          Deal Stages:
        </MDTypography>
        {Object.entries(STAGE_COLORS).map(([stage, color]) => (
          <MDBox key={stage} display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: 1 }} />
            <MDTypography variant="caption" textTransform="capitalize">
              {stage.replace('-', ' ')}
            </MDTypography>
          </MDBox>
        ))}
      </MDBox>
    </MDBox>
  );
}