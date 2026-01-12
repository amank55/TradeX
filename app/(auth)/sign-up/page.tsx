"use client"

import { Button } from "@/components/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState:{errors, isSubmitting},
  } = useForm<SignUpFormData>({
        defaultValues: {
         fullName: "",
         email: "",
         password: "",
         investmentGoals: "", 
        country: "India",
        riskTolerance: "Medium",  
        preferredIndustry: "Technology", 
        },
        mode: "onBlur"
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
    try {
      console.log(data)
    } catch(e) {
      console.log(e)
    }
  }
   

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputField
      name="fullName"
      label="Full Name"
      placeholder="Your Name"
      register={register}
      error={errors.fullName}
       validation={{ 
       required: 'Full name is required', 
       minLength: { 
      value: 2, 
      message: 'Name must be at least 2 characters' 
      } 
     }}
      />
       <InputField
      name="email"
      label="Email"
      placeholder="Your Email"
      register={register}
      error={errors.email}
       validation={{ 
       required: 'Email is required', 
       minLength: { 
      value: 2, 
      message: 'Name must be at least 2 characters' 
      } 
     }}
      />
      <InputField
      name="password"
      label="Password"
      type="password"
      placeholder="Enter a Strong Password"
      register={register}
      error={errors.password}
       validation={{ 
       required: 'Strong Password is Required', 
       minLength: { 
      value: 8, 
      message: 'Password must be at least 8 characters' 
      } 
     }}
      />
      <SelectField
      name="investmentGoals"
      label="Investment Goals"
      placeholder="Enter Your Investment Goals"
      options={INVESTMENT_GOALS}
      control={control}
      error={errors.investmentGoals}
      required
      />
      <SelectField
      name="riskTolerance"
      label="Risk Tolerance"
      placeholder="Enter Your Risk Tolerance"
      options={RISK_TOLERANCE_OPTIONS}
      control={control}
      error={errors.riskTolerance}
      required
      />
      <SelectField
      name="preferredIndustry"
      label="Preferred Industry"
      placeholder="Enter Your Preferred Industry"
      options={PREFERRED_INDUSTRIES}
      control={control}
      error={errors.preferredIndustry}
      required
      />
        <Button type="submit" disabled={isSubmitting} className="green-btn w-full mt-5">
        {isSubmitting? 'create Account' : 'Start Your Free Journey'}
       </Button>

      </form> 
    </>
  );
};

export default SignUp;
