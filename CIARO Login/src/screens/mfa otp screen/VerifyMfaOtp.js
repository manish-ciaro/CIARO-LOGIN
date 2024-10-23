import React, { useEffect, useState } from "react";
import {
  bgColors,
  fontSize,
  fontWeight,
  GlobleStyle,
} from "../../styles/Theme";
import {
  Box,
  styled,
  Grid,
  Typography,
  Link,
  Button,
  Snackbar,
} from "@mui/material";
import OTPInput from "react-otp-input";
import CustomeButton from "../../component/CustomeButton";
import secondImg from "../../assest/image02.png";
import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { superAdminVerifyOTP } from "../../services/VerifyOTP";
import { superAdminSendOTP } from "../../services/SendOTP";
import { checkResetPasswordToken } from "../../services/SACheckResetPassToken";
import { AuthMFAOtp } from "../../services/AuthMFAOtp";

export default function VerifyMfaOtp() {
  const {
    empEmail,

  } = useContext(UserContext);
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [isResendLinkDisabled, setIsResendLinkDisabled] = useState(false);
  const [isOTPLength, setIsOTPLength] = useState(true);
  const [otpError, setOtpError] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [open, setOpen] = useState(false);
  const [tokenToastMsg, setTokenToastMsg] = useState("")

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const onOtpChange = (otp) => {
    setOTP(otp);
    setOtpError("");
    otp.trim(" ") && otp.length === 6 ? setIsOTPLength(false) : setIsOTPLength(true)
  };

  const verifyOTP = async () => {
    const checkOTPResponse = await AuthMFAOtp(empEmail, OTP);
    if (checkOTPResponse?.error) {
      setOtpError(checkOTPResponse?.error);
    } else {
      setOtpError("");
      console.log(checkOTPResponse)
  };
}
  return (
    <GlobleStyle>
      <OtpScreenStyle>
        <Box className="main-container">
          <Grid container style={{ backgroundColor: bgColors.lightBlue }}>
            <Grid item sm={6} md={6} xl={6} lg={6} className="img-grid">
              <Box className="eclipse-style"></Box>
              <img
                src={secondImg}
                alt="forgotPasswordImg"
                className="absolute w-[36vw] top-1/2 left-2 -translate-y-1/2 "
              />
            </Grid>
            <Grid
              item
              sm={5}
              md={5}
              xl={5}
              lg={5}
              className="centered-box-container"
            >
              <Box className="centered-box h-4/6 2xl:h-2/3 xl:ml-6 ">
                <Box className="h-4/5 flex flex-col justify-around ">
                  <Box>
                    <Typography className="verify-otp-heading p-5 pb-0">
                      Enter verification code
                    </Typography>
                    <Typography className="p-5 pt-0 sub-heading-text">
                      We’ve sent a code to 
                    </Typography>
                  </Box>
                  <Box className="box-align-center">
                    <Box>
                      <OTPInput
                        value={OTP}
                        onChange={onOtpChange}
                        numInputs={6}
                        renderSeparator={
                          <span style={{ width: "10px" }}></span>
                        }
                        otpType="number"
                        className="otp-input-style"
                        containerStyle={{
                          display: " flex",
                          alignItems: " center",
                          width: "100%",
                          justifyContent: " center",
                        }}
                        shouldAutoFocus={true}
                        inputType="number"
                        inputStyle={{
                          border: `1px solid ${otpError ? "red" : "black"}`,
                          borderRadius: "15px",
                          width: "11%",
                          height: "50px",
                          fontSize: "12px",
                          color: "#000",
                          fontWeight: "400",
                          caretColor: "blue",
                        }}
                        focusStyle={{
                          border: "1px solid #CFD3DB",
                          outline: "none",
                        }}
                        renderInput={(props) => (
                          <input {...props} inputMode="numeric" />
                        )}
                      />
                      <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        message={tokenToastMsg}
                        anchorOrigin={{
                          vertical: "bottom", 
                          horizontal: "right",
                        }}
                      />
                      {otpError ? (
                        <Typography className="error-msg pl-12 pt-2">
                          {otpError}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                  <CustomeButton
                    label="Verify"
                    className="verify-btn"
                    disable={isOTPLength}
                    onClick={verifyOTP}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </OtpScreenStyle>
    </GlobleStyle>
  );
}

const OtpScreenStyle = styled(Box)({
  "& .link-tag": {
    textDecoration: "none",
    cursor: "pointer",
    textTransform: "none",
  },
  "& input::-webkit-inner-spin-button": {
    webkitAppearance: "none",
    margin: 0,
  },
  "& .link-text": {
    textDecoration: "none",
    color: bgColors.skyBlue,
  },
  "& .link-box": {
    display: "flex",
    alignItems: "baseline",
    padding: "0 8%",
  },
  "& .resend-code": {
    fontSize: fontSize.h6,
    fontWeight: fontWeight.semibold,
  },
  "& .verify-btn": {
    width: "35%",
    height: "7vh",
  },
  "& .verify-otp-heading": {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.h4,
  },
  "& .sub-heading-text": {
    fontWeight: fontWeight.medium,
  },
  "& .otp-input-style": {
    display: " flex",
    alignItems: " center",
    width: "100%",
    justifyContent: " center",
  },

  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
    {
      display: "none",
      WebkitAppearance: "none",
    },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& .img-grid": {
    "@media(max-width: 600px)": {
      display: "none",
    },
  },
});