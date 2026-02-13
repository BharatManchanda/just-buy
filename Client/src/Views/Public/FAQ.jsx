import { faqData } from "./Constant";
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails,
  Box, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, Alert
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const Faqs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <QuestionAnswerIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary.dark">
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Quick answers about our 10-minute delivery service.
        </Typography>
      </Box>

      {faqData.map((faq, index) => (
        <Accordion key={index} sx={{ mb: 2, borderRadius: 1, boxShadow: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default Faqs;
