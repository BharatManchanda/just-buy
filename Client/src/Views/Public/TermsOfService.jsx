import { termsContent } from './Constant'; 
import React, { useState } from 'react';
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails,
  Box, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, Alert
} from "@mui/material";
import GavelIcon from '@mui/icons-material/Gavel';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Box textAlign="center" mb={4}>
        <GavelIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Buy Now Terms of Service
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          (Effective Date: {termsContent.effectiveDate})
        </Typography>
      </Box>

      {termsContent.sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
            {section.title}
          </Typography>
          <Typography paragraph color="text.secondary">
            {section.description}
          </Typography>

          {section.title.includes('10-Minute Promise') && (
            <Alert severity="warning" sx={{ my: 2 }}>
              <List sx={{ listStyleType: 'disc', pl: 3 }}>
                {section.bulletPoints.map((point, i) => (
                  <ListItem key={i} sx={{ display: 'list-item', py: 0 }}>
                    <Typography variant="body2" component="span" dangerouslySetInnerHTML={{ __html: point }} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          {section.listItems && (
            <List sx={{ listStyleType: 'disc', pl: 3 }}>
              {section.listItems.map((item, i) => (
                <ListItem key={i} sx={{ display: 'list-item', py: 0 }}>
                  <Typography variant="body2" component="span" dangerouslySetInnerHTML={{ __html: item }} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default TermsOfService;
