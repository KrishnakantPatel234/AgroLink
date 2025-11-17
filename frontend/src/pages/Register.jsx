import React, { useState } from "react";
import PhoneLogin from "../components/auth/PhoneLogin";
import OTPVerify from "../components/auth/OTPVerify";
import ProfileSetup from "../components/auth/ProfileSetup";

const Register = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  // Step 1 → OTP Sent
  const handleOTPSent = (phoneNumber) => {
    setPhone(phoneNumber);
    setStep(2);
  };

  // Step 2 → OTP Verified
  const handleOTPVerified = (id) => {
    setUserId(id);
    setStep(3);
  };

  // Step 3 → Profile Completed
  const handleProfileDone = () => {
    window.location.href = "/dashboard";
  };

  return (
    <>
      {step === 1 && <PhoneLogin onOTPSent={handleOTPSent} />}
      {step === 2 && <OTPVerify phone={phone} onVerified={handleOTPVerified} />}
      {step === 3 && <ProfileSetup userId={userId} onProfileDone={handleProfileDone} />}
    </>
  );
};

export default Register;
