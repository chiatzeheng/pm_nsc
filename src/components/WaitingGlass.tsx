import { Typography, useTheme, Box } from "@mui/material";

import { MagnifyingGlass } from "react-loader-spinner";

const WaitingGlass = () => {
  const theme = useTheme();
  return (
    <Box flex="1" alignItems={"center"} display="flex" flexDirection={"column"}>
      <MagnifyingGlass
        visible={true}
        height="100%"
        width="80"
        ariaLabel="MagnifyingGlass-loading"
        wrapperStyle={{}}
        wrapperClass="MagnifyingGlass-wrapper"
        color={theme.palette.primary.main}
        glassColor="#c0efff"
        // glassColor={theme.palette.primary.main}
        // color = '#e15b64'
      />
      <Typography fontWeight={"bold"}>Waiting...</Typography>
    </Box>
  );
};

export default WaitingGlass;
