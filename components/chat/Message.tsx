import { Avatar, Grid, styled, Typography } from "@mui/material";
import React from "react";
import dayjs from "dayjs";

interface ChatTextProps {
  align: "left" | "right";
}

const ChatText = styled(Typography, {
  shouldForwardProp: (prop) => !["align"].includes(prop as string),
})<ChatTextProps>(({ align }: { align: "left" | "right" }) => ({
  color: align === "left" ? undefined : "#fff",
  backgroundColor: align === "left" ? "#f5f5f5" : "#3f51b5",
  borderTopRightRadius: align === "left" ? "20px" : undefined,
  borderTopLeftRadius: align === "right" ? "20px" : undefined,
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
  display: "inline-block",
  padding: "8px 16px",
  marginBottom: "4px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontSize: "15px",
}));

const Message = (props: {
  position: "left" | "right";
  message?: string;
  timestamp?: string | number | Date;
  photo?: string;
  displayName?: string;
}) => {
  const {
    position = "left",
    message = "no message",
    timestamp,
    photo = "ChatGPT_logo.svg",
    displayName = "null",
  } = props;
  const showDateDayjs = timestamp ? dayjs(timestamp) : dayjs();
  const diffDay = dayjs(showDateDayjs).diff(dayjs(), "day");
  return (
    <Grid container spacing={2}>
      {position === "left" && (
        <Grid item xs={1}>
          <Avatar alt={displayName} src={photo}></Avatar>
        </Grid>
      )}
      <Grid item xs={10} marginRight={"8px"} textAlign={position}>
        <Typography
          variant="caption"
          display="block"
          color={"rgba(0, 0, 0, 0.54)"}
          textAlign={position}
          suppressHydrationWarning={true} // nextjs error
        >
          {diffDay === 0
            ? showDateDayjs.format("HH:mm:ss")
            : showDateDayjs.format("MM/DD HH:mm:ss")}
        </Typography>
        <ChatText variant="body1" align={position}>
          {message}
        </ChatText>
      </Grid>
      {position === "right" && (
        <Grid item xs={1}>
          <Avatar alt={displayName} src={photo}></Avatar>
        </Grid>
      )}
    </Grid>
  );
};

export default Message;
