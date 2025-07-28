import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";
import { Typography, Card, CardContent, TextField, InputAdornment } from '@mui/material';
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

interface EbitdaFormProps {
  form: UseFormReturn<EbitdaData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: EbitdaData) => void;
  calculateEbitda: () => number;
}

export default function EbitdaForm({ form, onNext, onPrev, onDataChange, calculateEbitda }: EbitdaFormProps) {
  const watchedValues = form.watch();
  const ebitdaTotal = calculateEbitda();

  const onSubmit = (data: EbitdaData) => {
    onDataChange(data);
    onNext();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleFieldChange = (fieldName: keyof EbitdaData, value: string) => {
    const numValue = Number(value) || 0;
    form.setValue(fieldName, numValue);
    onDataChange(form.getValues());
  };

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox mb={4} display="flex" alignItems="center">
        <MDBox
          sx={{
            backgroundColor: '#0A1F44',
            borderRadius: '50%',
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 3
          }}
        >
          <Calculator size={32} color="#00BFA6" />
        </MDBox>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
            Financial Information
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Please provide your company's financial information for the most recent fiscal year to calculate EBITDA.
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Form Container */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Financial Data Section */}
            <MDBox mb={4}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
                Financial Data
              </MDTypography>
              
              <MDBox mb={3}>
                <TextField
                  label="Net Income *"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  {...form.register("netIncome")}
                  onChange={(e) => handleFieldChange("netIncome", e.target.value)}
                  helperText="Your company's net income for the most recent fiscal year"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={3}>
                <TextField
                  label="Interest Expense *"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  {...form.register("interest")}
                  onChange={(e) => handleFieldChange("interest", e.target.value)}
                  helperText="Interest paid on loans and credit facilities"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={3}>
                <TextField
                  label="Tax Expense *"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  {...form.register("taxes")}
                  onChange={(e) => handleFieldChange("taxes", e.target.value)}
                  helperText="Income tax expenses for the fiscal year"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={3}>
                <TextField
                  label="Depreciation & Amortization *"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  {...form.register("depreciation")}
                  onChange={(e) => handleFieldChange("depreciation", e.target.value)}
                  helperText="Total depreciation and amortization expenses"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>
            </MDBox>

            {/* EBITDA Summary Card */}
            <MDBox mb={4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)',
                  color: 'white',
                  borderRadius: 2,
                  p: 3
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
                    EBITDA Calculation
                  </MDTypography>
                </MDBox>
                
                <MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Net Income:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {formatCurrency(watchedValues.netIncome || 0)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      + Interest:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {formatCurrency(watchedValues.interest || 0)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      + Taxes:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {formatCurrency(watchedValues.taxes || 0)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      + Depreciation & Amortization:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {formatCurrency(watchedValues.depreciation || 0)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox
                    sx={{
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                      pt: 2
                    }}
                  >
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                        EBITDA:
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#5EEAD4' }}>
                        {formatCurrency(ebitdaTotal)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>

            {/* Navigation Buttons */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={onPrev}
                startIcon={<ArrowLeft size={16} />}
              >
                Previous
              </MDButton>
              
              <MDButton
                type="submit"
                variant="gradient"
                color="primary"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  background: 'linear-gradient(135deg, #C41261 0%, #E91E63 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #AD0E55 0%, #C2185B 100%)',
                  }
                }}
              >
                Next: Adjustments
              </MDButton>
            </MDBox>
          </form>
        </CardContent>
      </Card>
    </MDBox>
  );
}