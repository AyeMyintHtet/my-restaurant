import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box, Typography, Divider, Grid, Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import {QRCodeSVG} from 'qrcode.react';

export type ReceiptData = {
    menuTier?:string,
    startTime?:string,
    endTime?:string,
    customerCount?:string,
    cost?:string,
    time?: string
    qrCode?: string
};
type BuffetReceiptProps = {
    data:ReceiptData
    
}
export type BuffetReceiptHandle = {
  handlePrint: () => void;
};
const BuffetReceiptContent = React.forwardRef<HTMLDivElement, BuffetReceiptProps>(
  ({data}, ref) => {

    return (
        <Box
        ref={ref}
        sx={{
          position: 'absolute',
          left: '-9999px',
          p: 2,
          width: '80mm', // or a fixed px like '300px'
          fontFamily: 'monospace',
          '@media print': {
            position: 'static', 
            left: 0,
            width: '80mm',
            boxShadow: 'none',
            margin: 0,
            transform: 'scale(2)',
            transformOrigin: 'top left',
          },
        }}
      >
        <Typography variant="h6" align="center" fontWeight="bold">
          Buffet POS
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          {data.time}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <div className='flex justify-center mb-2'>
        
          <QRCodeSVG value={`${'window.location.host'}/`} />
        
        </div>        

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}><Typography variant="body2">Tier:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{data.menuTier}</Typography></Grid>

          <Grid item xs={6}><Typography variant="body2">Start Time:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{data.startTime}</Typography></Grid>

          <Grid item xs={6}><Typography variant="body2">End Time:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{data.endTime}</Typography></Grid>

          <Grid item xs={6}><Typography variant="body2">Customer Count:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{data.customerCount}</Typography></Grid>

          <Grid item xs={6}><Typography variant="body2">Cost:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{data.cost}</Typography></Grid>
        </Grid>
          <Divider sx={{ mt: 2 }} />
          <Grid container spacing={2}>
          <Grid item xs={6}><Typography variant="body2">Taxes:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">8%</Typography></Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={6}><Typography variant="body2">Total:</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2">{ (Number(data.cost) * 1.08).toString()}</Typography></Grid>
          </Grid>
        <Divider sx={{ mt: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography align="center" variant="caption">Thank you for dining with us!</Typography>
        </div>
      </Box>
    );
  }
);
BuffetReceiptContent.displayName = 'BuffetReceiptContent';


const BuffetReceipt = forwardRef<BuffetReceiptHandle, BuffetReceiptProps>(({data}:{data:ReceiptData},ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerPrint = useReactToPrint({contentRef});

    const handlePrint = () => {
      console.log('Print asdfdsaf');
        if (contentRef.current) {
          triggerPrint(); // wrapped with useReactToPrint
        } else {
          setTimeout(() => {
            if (contentRef.current) triggerPrint();
          }, 100); // small delay
        }
      };
      useImperativeHandle(ref, () => ({
        handlePrint,
      }));
  return (
      <BuffetReceiptContent ref={contentRef} data={data} />
  );
});

export default BuffetReceipt;