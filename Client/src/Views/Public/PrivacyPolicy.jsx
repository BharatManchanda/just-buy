import { privacyPolicyContent } from './Constant'; 
import React, { useState } from 'react';
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails,
  Box, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, Alert
} from "@mui/material";
import PolicyIcon from '@mui/icons-material/Policy';


const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Box textAlign="center" mb={4}>
        <PolicyIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Just Buy Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          (Effective Date: {privacyPolicyContent.effectiveDate})
        </Typography>
      </Box>

      {privacyPolicyContent.sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4, p: 2, borderLeft: 4, borderColor: 'primary.light', bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {section.title}
          </Typography>
          <Typography paragraph color="text.secondary">
            {section.description}
          </Typography>

          {section.list && (
            <List dense>
              {section.list.map((item, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemText
                    primary={
                      <Typography component="span" fontWeight={500}>
                        {item.header}
                      </Typography>
                    }
                    secondary={item.text}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default PrivacyPolicy;
