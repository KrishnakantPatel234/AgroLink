import React, { useState } from "react";
import PhoneLogin from "./components/PhoneLogin";
import OTPVerify from "./components/OTPVerify";
import RoleSelect from "./components/RoleSelect";
import ProfileSetup from "./components/ProfileSetup";
import CreatePost from "./components/CreatePost";
import FarmerDashboard from "./components/FarmerDashboard";

function App() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  return (
    <>
      {step === "phone" && (
        <PhoneLogin
          onOTPSent={(num) => {
            setPhone(num);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <OTPVerify
          phone={phone}
          onVerified={(id) => {
            setUserId(id);
            setStep("role");
          }}
        />
      )}

      {step === "role" && (
        <RoleSelect
          userId={userId}
          onRoleSelected={(role) => {
            setRole(role);
            setStep("profile");
          }}
        />
      )}

      {step === "profile" && (
        <ProfileSetup
          userId={userId}
          role={role}
          onProfileDone={() => setStep("dashboard")}
        />
      )}

      {step === "create-post" && (
        <CreatePost
          userId={userId}
          onPostCreated={() => setStep("dashboard")}
        />
      )}

      {step === "dashboard" && role === "farmer" && (
        <FarmerDashboard userId={userId} />
      )}



      {step === "role" && <RoleSelect userId={userId} />}
    </>
  );
}

export default App;
