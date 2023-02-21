import React from "react";
//
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// icons
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// utils, interface and styles
import useGlobalStyle, { bg } from "@src/styles";
import { ExamInstructionsFunc } from "./interfaceType";
import { request } from "@src/utils";
import { useRouter } from "next/router";
import format from "date-fns/format";

const ExamInstructionsPage: ExamInstructionsFunc = (props) => {
  const globalStyle = useGlobalStyle();
  const { exam /* auth */ } = props;
  const router = useRouter();
  async function getProctoredId() {
    try {
      const { data } = await request.post({
        url: `/centre/${exam.id}/protor-content`,
      });
      if (data.id)
        router.push(`/exams/${exam.slug}/start?proctoredId=${data.id}`);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box
      pt={8}
      display="flex"
      component="main"
      minHeight="100vh"
      flexDirection="column"
      justifyContent="center"
      sx={{ ...bg().bgDustyPrimary }}
    >
      <Box component="section" sx={{ pt: 4, pb: 8, px: { md: 6 } }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Grid item xs={12} md={8} xl={9}>
              <Typography mb={3} variant="h2" component="h1">
                {exam.name}
              </Typography>
              <Typography mb={2} variant="h5">
                Instructions:
              </Typography>
              <Box dangerouslySetInnerHTML={{ __html: exam.instruction }} />
            </Grid>
            <Grid item xs={12} md={4} xl={3}>
              <Box
                p={3}
                bgcolor="white"
                borderRadius={2}
                className={globalStyle.paperShadowSm}
              >
                <Stack
                  mb={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    mb={0}
                    variant="h6"
                    display="flex"
                    alignItems="center"
                  >
                    <HelpOutlineOutlinedIcon fontSize="small" color="primary" />
                    &nbsp; No of Questions:
                  </Typography>
                  <Typography paragraph mb={0}>
                    {exam.questionCount}
                  </Typography>
                </Stack>
                <Stack
                  mb={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    mb={0}
                    variant="h6"
                    display="flex"
                    alignItems="center"
                  >
                    <ScheduleOutlinedIcon fontSize="small" color="primary" />
                    &nbsp; Exam Duration:
                  </Typography>
                  <Typography paragraph mb={0}>
                    {exam.duration} Minutes
                  </Typography>
                </Stack>
                {exam.startDate && (
                  <Stack
                    mb={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      mb={0}
                      variant="h6"
                      display="flex"
                      alignItems="center"
                    >
                      <CalendarMonthOutlinedIcon
                        fontSize="small"
                        color="primary"
                      />
                      &nbsp; Exam Starts:
                    </Typography>
                    <Typography paragraph mb={0}>
                      <> {format(new Date(exam.startDate), "dd-MM-yyy")}</>
                    </Typography>
                  </Stack>
                )}
                {exam.endDate && (
                  <Stack
                    mb={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      mb={0}
                      variant="h6"
                      display="flex"
                      alignItems="center"
                    >
                      <CalendarMonthOutlinedIcon
                        fontSize="small"
                        color="primary"
                      />
                      &nbsp; Exam Ends:
                    </Typography>
                    <Typography paragraph mb={0}>
                      <>{format(new Date(exam.endDate), "dd-MM-yyy")}</>
                    </Typography>
                  </Stack>
                )}
                <Button
                  onClick={() => {
                    exam.hasProctor
                      ? getProctoredId()
                      : router.push(`/exams/${exam.slug}/start`);
                  }}
                  size="large"
                  disableElevation
                  variant="contained"
                  sx={{
                    mt: 4,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Start Exam
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
export default ExamInstructionsPage;
