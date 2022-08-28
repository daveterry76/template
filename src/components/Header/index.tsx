import React, { Fragment } from "react";
// next components
import Image from "next/image";
import NextLink from "next/link";
// mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
//
import { useTheme } from "@mui/material/styles";
//
import { Link as MuiLink } from "@mui/material";
// components/resources
import AppDrawer from "./AppDrawer";
import HideOnScroll from "./HideOnScroll";
//
import useGlobalStyle from "@src/styles/index";
// interface
import { HeaderFunc } from "./interfaceType";

const Header: HeaderFunc = () => {
  const theme = useTheme();
  const globalStyle = useGlobalStyle();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <HideOnScroll>
        <AppBar
          component="nav"
          elevation={0}
          className={globalStyle.bgWhiteGlossy}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Image
                src="/images/logo.png"
                alt="Contentionary logo"
                width={157}
                height={30}
              />
              {isMatch ? (
                <AppDrawer />
              ) : (
                <Fragment>
                  <Box
                    sx={{
                      marginLeft: 2,
                      flexGrow: 1,
                      display: {
                        xs: "none",
                        md: "flex",
                        justifyContent: "space-between",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <NextLink href="/#apps" passHref>
                        <Button component={MuiLink} sx={{ color: "#616161" }}>
                          Apps
                        </Button>
                      </NextLink>
                      <NextLink href="/#resources" passHref>
                        <Button component={MuiLink} sx={{ color: "#616162" }}>
                          Resources
                        </Button>
                      </NextLink>
                      <NextLink href="/#pricing" passHref>
                        <Button component={MuiLink} sx={{ color: "#616161" }}>
                          Pricing
                        </Button>
                      </NextLink>
                      <NextLink href="/market-place" passHref>
                        <Button component={MuiLink} sx={{ color: "#616161" }}>
                          Marketplace
                        </Button>
                      </NextLink>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <NextLink href="/" passHref>
                        <MuiLink>Login</MuiLink>
                      </NextLink>
                      <NextLink href="/" passHref>
                        <Button
                          size="large"
                          disableElevation
                          variant="contained"
                          component={MuiLink}
                          className={globalStyle.bgGradient}
                        >
                          Create Account
                        </Button>
                      </NextLink>
                    </Stack>
                  </Box>
                </Fragment>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
    </>
  );
};
export default Header;
