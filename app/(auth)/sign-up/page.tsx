"use client"

import { Button } from "@/components/button";
import InputField from "@/components/forms/InputField";
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
        country: "India",
        riskTolerance: "medium",
        preferredIndustry:"technology",
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
      label="full name"
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
        <Button type="submit" disabled={isSubmitting} className="green-btn w-full mt-5">
        {isSubmitting? 'create Account' : 'Start Your Free Journey'}
       </Button>

      </form> 
    </>
  );
};

export default SignUp;
